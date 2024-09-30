"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import { useArticleStore } from "@/store/useArticleStore";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
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
        <div className="text-lg font-semibold text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg font-semibold text-red-500">{error}</div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg font-semibold text-gray-600">
          Article not found
        </div>
      </div>
    );
  }

  return (
    <div className="mt-16 relative min-h-screen bg-gradient-to-r from-blue-50 to-purple-100">
      <Head>
        <title>{article.title}</title>
        <meta name="description" content={article.title} />
      </Head>
      <div className="absolute left-4 top-4 z-10">
        <button
          onClick={() => router.back()}
          className="p-3 bg-white hover:bg-gray-200 rounded-full shadow-lg flex items-center justify-center transition-transform duration-300 hover:scale-105"
        >
          <IoMdArrowRoundBack className="text-black text-3xl" />
        </button>
      </div>
      <section className="relative flex justify-center items-center h-auto py-10">
        <div className="absolute inset-0 bg-black opacity-50 z-0"></div>
        <div className="relative z-30 flex justify-center items-center">
          <img
            className="rounded-xl shadow-lg"
            src={article.image || "/images/default.jpg"}
            alt={article.title}
            style={{
              maxWidth: "100%",
              maxHeight: "220px",
              objectFit: "contain",
            }}
          />
        </div>
        <div className="relative ml-2 w-[48rem] z-10 text-center text-white mt-6">
          <h1 className="text-4xl font-bold drop-shadow-lg">{article.title}</h1>
          <p className="mt-2 text-lg italic">
            Published on{" "}
            {new Date(article.createdAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
      </section>

      {/* Article Info */}
      <section className="max-w-4xl mx-auto px-4 py-10 bg-white   shadow-lg rounded-lg -mt-12  z-20 relative">
        <div className="text-center">
          <p className="text-lg text-gray-700">
            Category:{" "}
            <span className="font-semibold text-blue-600">
              {article.category}
            </span>{" "}
            /{" "}
            <span className="font-semibold text-purple-600">
              {article.subCategory}
            </span>
          </p>
        </div>
        <div className="mt-6 text-gray-900 leading-relaxed text-lg">
          <div className="prose max-w-full mx-auto">
            <div
              dangerouslySetInnerHTML={{ __html: article.content }}
              className="space-y-4"
            />
          </div>
        </div>
        <p className="text-right text-lg font-medium text-gray-600">
          Written by{" "}
          <span className="font-semibold text-gray-800">
            {article?.doctor?.name || "Unknown Doctor"}
          </span>
        </p>
      </section>
    </div>
  );
};

export default ArticlePage;
