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
    <div className="mt-16 relative">
      <div className="absolute left-4 z-10 top-4">
        <button
          onClick={() => router.back()}
          className="p-3 bg-gray-200 hover:bg-gray-300 rounded-full shadow-lg flex items-center justify-center"
        >
          <IoMdArrowRoundBack className="text-black text-xl" />
        </button>
      </div>
      <Head>
        <title>{article.title}</title>
        <meta name="description" content={article.title} />
      </Head>
      <div className="relative">
        {/* Hero Image */}
        <div className="flex justify-center bg-gray-100">
          <img
            className="w-3/5"
            src={article.image ? article.image : "/images/default.jpg"}
          ></img>
        </div>
        <div className="bg-gray-100 flex items-center justify-center">
          <h1 className="text-3xl mt-2 font-bold text-gray-700 drop-shadow-lg">
            {article.title}
          </h1>
        </div>
        {/* Article Content */}
        <div className="flex justify-center pb-12 pt-4 px-4 bg-gray-100">
          <div className="max-w-3xl w-full">
            <div className="mb-6">
              <p className="text-lg text-gray-600">
                Category: {article.category} / {article.subCategory}
              </p>
              <p className="text-sm text-gray-500">
                Published on{" "}
                {new Date(article.createdAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
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
