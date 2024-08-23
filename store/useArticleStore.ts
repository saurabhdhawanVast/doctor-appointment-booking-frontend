// src/store/useArticleStore.ts
import create from "zustand";
import axios from "axios";

interface Article {
  _id: string;
  title: string;
  content: string;
  category: string;
  subCategory: string;
  createdAt: Date;
  doctorId: string;
}

interface ArticleState {
  articles: Article[];
  fetchArticles: () => Promise<void>;
  createArticle: (article: Omit<Article, "_id" | "createdAt">) => Promise<void>;
}

export const useArticleStore = create<ArticleState>((set) => ({
  articles: [],

  fetchArticles: async () => {
    try {
      const response = await axios.get("/api/articles");
      set({ articles: response.data });
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  },

  createArticle: async (article) => {
    try {
      await axios.post("http://localhost:5000/articles", article);
    } catch (error) {
      console.error("Error creating article:", error);
    }
  },
}));
