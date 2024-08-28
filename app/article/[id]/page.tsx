"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Head from "next/head";
import { useArticleStore } from "@/store/useArticleStore";

interface ArticlePageProps {
  params: {
    id: string;
  };
}

interface Article {
  _id: string;
  title: string;
  content: string;
  doctor: string;
  category: string;
  subCategory: string;
  createdAt: string;
  image: string;
}

const ArticlePage = ({ params }: ArticlePageProps) => {
  const { id } = params;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const article = useArticleStore((state) => state.article);
  const getArticle = useArticleStore((state) => state.getArticle);

  useEffect(() => {
    if (id) {
      const fetchArticle = async () => {
        try {
          await getArticle(id);
        } catch (error) {
          setError("Failed to load article");
        } finally {
          setLoading(false);
        }
      };

      fetchArticle();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">{error}</div>
    );
  }

  if (!article) {
    return (
      <div className="flex items-center justify-center h-screen">
        Article not found
      </div>
    );
  }

  return (
    <div className="mt-16">
      <Head>
        <title>{article.title}</title>
        <meta name="description" content={article.title} />
      </Head>
      <div className="relative">
        {/* Hero Image */}
        <div
          className="w-full h-[60vh] bg-cover bg-center"
          style={{
            backgroundImage: `url(${
              article.image ? article.image : "/images/default.jpg"
            })`,
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-5 flex items-center justify-center">
            <h1 className="text-5xl font-bold text-white drop-shadow-lg">
              {article.title}
            </h1>
          </div>
        </div>

        {/* Article Content */}
        <div className="flex justify-center py-12 px-4 bg-gray-100">
          <div className="max-w-3xl w-full">
            <div className="mb-6">
              <p className="text-lg text-gray-600">
                Category: {article.category} / {article.subCategory}
              </p>
              <p className="text-sm text-gray-500">
                Published on {new Date(article.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div
              className="text-lg text-gray-800 leading-relaxed space-y-6"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            <div className="mt-12 text-right">
              <p className="text-sm text-gray-600">
                Written by {article?.doctor?.name}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticlePage;
