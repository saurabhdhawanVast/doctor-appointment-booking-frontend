// src/store/useArticleStore.ts
import create from "zustand";
import axios from "axios";
import useLoginStore from "./useLoginStore";

interface Article {
  _id: string;
  title: string;
  content: string;
  category: string;
  image: string;
  subCategory: string;
  createdAt: Date;
  doctorId?: string;
  doctor?: {
    name: string;
  };
}

interface ArticleState {
  articles: Article[];
  article: Article | null;
  editArticle: Article | null;
  fetchArticles: (query?: Record<string, any>) => Promise<void>;
  getArticle: (id?: string) => Promise<void>;
  setEditArticle: (Article: Article | null) => Promise<void>;
  createArticle: (article: Omit<Article, "_id" | "createdAt">) => Promise<void>;
  updateArticle: (article: Partial<Article>) => Promise<void>;
  removeArticle: (id: string) => Promise<void>;
}

export const useArticleStore = create<ArticleState>((set) => ({
  articles: [],
  article: null,
  editArticle: null,
  fetchArticles: async (query = {}) => {
    try {
      const token = useLoginStore.getState().token;
      const queryString = new URLSearchParams({
        filter: JSON.stringify(query),
      }).toString();
      const response = await axios.get(
        `http://localhost:3000/articles?${queryString}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      set({ articles: response.data });
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  },
  setEditArticle: async (Article) => {
    set({ editArticle: Article });
  },
  getArticle: async (id) => {
    try {
      const token = useLoginStore.getState().token;
      const response = await axios.get(`http://localhost:3000/articles/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      set({ article: response.data });
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  },

  createArticle: async (article) => {
    try {
      const token = useLoginStore.getState().token;
      await axios.post("http://localhost:3000/articles", article, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Error creating article:", error);
    }
  },
  updateArticle: async (article) => {
    try {
      const token = useLoginStore.getState().token;
      let articleId = article._id;
      delete article._id;
      let updatedArticle = await axios.patch(
        `http://localhost:3000/articles/${articleId}`,
        article,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (updatedArticle && updatedArticle.data) {
        set((state) => ({
          articles: state.articles.map((a) =>
            a._id === updatedArticle.data._id
              ? { ...a, ...updatedArticle.data }
              : a
          ),
        }));
      }
    } catch (error) {
      console.error("Error updating article:", error);
    }
  },
  removeArticle: async (id) => {
    try {
      const token = useLoginStore.getState().token;
      await axios.delete(`http://localhost:3000/articles/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set((state) => ({
        articles: state.articles.filter((article) => article._id !== id),
      }));
    } catch (error) {
      console.error("Error deleting article:", error);
    }
  },
}));
