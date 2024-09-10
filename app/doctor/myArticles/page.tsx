"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useArticleStore } from "@/store/useArticleStore";
import { debounce } from "@mui/material";
import { useRouter } from "next/navigation";
import { FiEdit, FiTrash2 } from "react-icons/fi"; // Edit and Delete icons
import useLoginStore from "@/store/useLoginStore";
import { toast } from "react-toastify";
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

const MyArticlesList = () => {
  const articles = useArticleStore((state) => state.articles);
  const fetchArticles = useArticleStore((state) => state.fetchArticles);
  const setEditArticle = useArticleStore((state) => state.setEditArticle);
  const removeArticle = useArticleStore((state) => state.removeArticle);
  const doctor = useLoginStore((state) => state.doctor);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchAndSetArticles = async () => {
      setLoading(true);
      if (doctor) await fetchArticles({ doctor: doctor._id });
      setLoading(false);
    };
    fetchAndSetArticles();
  }, [doctor, fetchArticles]);

  function truncateHtmlContent(html: string, maxLength: number): string {
    const div = document.createElement("div");
    div.innerHTML = html;
    let truncatedText = "";
    let totalLength = 0;
    const childNodesArray = Array.from(div.childNodes) as HTMLElement[];
    for (let child of childNodesArray) {
      const childText = child.textContent || child.innerText || "";
      totalLength += childText.length;

      if (totalLength > maxLength) {
        const remainingLength = maxLength - (totalLength - childText.length);
        truncatedText += childText.slice(0, remainingLength) + "...";
        break;
      } else {
        truncatedText += child.outerHTML || child.nodeValue;
      }
    }
    return truncatedText;
  }

  const handleArticleClick = async (id: string) => {
    router.push(`/doctor/article/${id}`);
  };

  const handleDelete = async (id: string) => {
    console.log("Delete article with id:", id);
    await removeArticle(id);
    toast.success("Articles deleted successfully");
  };

  const handleEdit = (article: Article) => {
    setEditArticle(article);
    if (doctor) router.push(`/doctor/article-form/${doctor._id}`);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="py-4 mt-16"></div>
      <div className="mx-auto p-6 max-w-7xl">
        {loading ? (
          <div className="text-center text-gray-700">Loading...</div>
        ) : articles.length === 0 ? (
          <div className="text-center text-gray-700">No articles found.</div>
        ) : (
          <div className="space-y-6">
            {articles.map((article) => (
              <div
                key={article._id}
                className="relative bg-white p-6 rounded-lg shadow-lg hover:bg-blue-100 transition duration-300 cursor-pointer flex flex-col md:flex-row items-start"
                onClick={() => handleArticleClick(article._id)}
              >
                {/* Article Image */}
                <div className="relative h-48 w-full md:w-48 overflow-hidden rounded-lg mb-4 md:mb-0 md:mr-6">
                  <img
                    src={article.image || "/images/default.jpg"}
                    alt={article.title}
                    className="object-cover w-full h-full rounded-lg"
                  />
                </div>

                {/* Article Content */}
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {article.title}
                  </h3>
                  <div className="text-sm text-gray-500 mb-3">
                    <p>
                      By:{" "}
                      <span className="font-semibold text-gray-700">
                        Dr. {article?.doctor?.name || "Unknown"}
                      </span>
                    </p>
                    <p>
                      Published on:{" "}
                      <span className="font-semibold text-gray-700">
                        {new Date(article.createdAt).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </span>
                    </p>
                  </div>
                  <p
                    className="text-gray-700"
                    dangerouslySetInnerHTML={{
                      __html: truncateHtmlContent(article.content, 300),
                    }}
                  ></p>
                </div>

                {/* Action Icons */}
                <div
                  className="absolute top-4 right-4 flex space-x-3"
                  onClick={(e) => e.stopPropagation()} // Prevent card click
                >
                  <FiEdit
                    onClick={() => handleEdit(article)}
                    className="text-gray-500 hover:text-blue-600 cursor-pointer"
                    size={20}
                  />
                  <FiTrash2
                    onClick={() => handleDelete(article._id)}
                    className="text-gray-500 hover:text-red-600 cursor-pointer"
                    size={20}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyArticlesList;
