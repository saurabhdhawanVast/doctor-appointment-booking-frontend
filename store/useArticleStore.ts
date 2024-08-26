// src/store/useArticleStore.ts
import create from "zustand";
import axios from "axios";

interface Article {
  _id: string;
  title: string;
  content: string;
  category: string;
  image:string;
  subCategory: string;
  createdAt: Date;
  doctorId?: string;
  doctor?: {
    name: string;
  };
}

interface ArticleState {
  articles: Article[];
  fetchArticles: (query?: Record<string, any>) => Promise<void>;
  createArticle: (article: Omit<Article, "_id" | "createdAt">) => Promise<void>;
}

export const useArticleStore = create<ArticleState>((set) => ({
  articles: [],

  fetchArticles: async (query = {}) => {
    try {
      const queryString = new URLSearchParams({
        filter: JSON.stringify(query),
      }).toString();
      const response = await axios.get(
        `http://localhost:3000/articles?${queryString}`
      );
      console.log(response.data);
      set({ articles: response.data });
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  },

  createArticle: async (article) => {
    try {
      await axios.post("http://localhost:3000/articles", article);
    } catch (error) {
      console.error("Error creating article:", error);
    }
  },
}));
