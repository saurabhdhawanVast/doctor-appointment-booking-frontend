"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useArticleStore } from "@/store/useArticleStore";
import { debounce } from "@mui/material";
import { useRouter } from "next/navigation";
import { IoMdArrowDropdown, IoMdArrowDropright } from "react-icons/io";
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";
import { FaPlus, FaBook } from "react-icons/fa";
import useLoginStore from "@/store/useLoginStore";

interface Article {
  _id: string;
  title: string;
  content: string;
  image?: string;
  category: string;
  subCategory: string;
  doctor?: {
    name: string;
  };
  createdAt: Date;
}

const categories = [
  {
    name: "Healthy Hair",
    subCategories: [
      { name: "Hair Growth", imagePath: "/images/hairGrowth.jfif" },
      { name: "Hair Loss Prevention", imagePath: "/images/hairLoss.jfif" },
      { name: "Scalp Treatments", imagePath: "/images/scalp-treatment.jpg" },
      { name: "Hair Coloring", imagePath: "/images/hairColor.jfif" },
    ],
  },
  {
    name: "Healthy Skin",
    subCategories: [
      { name: "Acne Treatment", imagePath: "/images/acane.jfif" },
      { name: "Anti-Aging", imagePath: "/images/anti-aging.jfif" },
      { name: "Skin Hydration", imagePath: "/images/skin hydration.jfif" },
      { name: "Sun Protection", imagePath: "/images/sun protection.jfif" },
      { name: "Skin Brightening", imagePath: "/images/skin-brightning.jpg" },
    ],
  },
  {
    name: "Healthy Diet",
    subCategories: [
      { name: "Balanced Nutrition", imagePath: "/images/balance-diet.jpg" },
      { name: "Weight Management", imagePath: "/images/weight-manegement.jpg" },
      { name: "Detox Diet", imagePath: "/images/detox-diet.jpg" },
      { name: "Meal Planning", imagePath: "/images/meal-planning.jpg" },
      {
        name: "Nutritional Supplements",
        imagePath: "/images/nutrient-suppliment.jpg",
      },
    ],
  },
  {
    name: "Healthy Teeth",
    subCategories: [
      { name: "Brushing Techniques", imagePath: "/images/brushing.jpg" },
      { name: "Flossing Tips", imagePath: "/images/flossingtips.jpg" },
      { name: "Oral Hygiene", imagePath: "/images/27503.jpg" },
      { name: "Teeth Whitening", imagePath: "/images/whitning.jpg" },
    ],
  },
  {
    name: "General Health",
    subCategories: [
      { name: "Immunity Boost", imagePath: "/images/3985459.jpg" },
      { name: "Injury care", imagePath: "/images/injurysaf.jpg" },
      { name: "Healthy Digestion", imagePath: "/images/9344789.jpg" },
      { name: "Periods Care", imagePath: "/images/periods.jpg" },
      { name: "Sleep Better", imagePath: "/images/sleeping.jpg" },
    ],
  },
  {
    name: "Fitness & Exercise",
    subCategories: [
      { name: "Cardio Workouts", imagePath: "/images/cardio-workout.jpg" },
      { name: "Strength Training", imagePath: "/images/strength-training.jpg" },
      { name: "Meditation", imagePath: "/images/meditation.jpg" },
      { name: "Everyday Fitness", imagePath: "/images/everyday-fitness.jpg" },
      { name: "Yoga", imagePath: "/images/yoga.jpg" },
    ],
  },
  {
    name: "Pain Management",
    subCategories: [
      { name: "Back Pain", imagePath: "/images/back-pain.jpg" },
      { name: "Neck Pain", imagePath: "/images/neck-pain.jpg" },
      { name: "Headache", imagePath: "/images/headache.jfif" },
      { name: "Knee Pain", imagePath: "/images/kneePain.jfif" },
      { name: "Physical Therapy", imagePath: "/images/physicalTherapy.jfif" },
    ],
  },
  {
    name: "Mental Well-being",
    subCategories: [
      { name: "Stress Reduction", imagePath: "/images/stressReduction.jfif" },
      { name: "Depression Management", imagePath: "/images/depression.jfif" },
      { name: "Addiction", imagePath: "/images/addiction.jfif" },
      { name: "Counseling", imagePath: "/images/councelling.jfif" },
      { name: "Emotional Support", imagePath: "/images/emotionalSupport.jfif" },
      { name: "Anger Manegment", imagePath: "/images/angerManagement.jfif" },
    ],
  },
  {
    name: "Kids & Parenting",
    subCategories: [
      { name: "Child Development", imagePath: "/images/childDevelopment.jpg" },
      { name: "Parenting", imagePath: "/images/parenting.jpg" },
      {
        name: "Childhood Nutrition",
        imagePath: "/images/nutrient-suppliment.jpg",
      },
      { name: "During/After Pregnancy", imagePath: "/images/pregnancy.jpg" },
      {
        name: "Positive Discipline",
        imagePath: "/images/positiveattitude.jpg",
      },
    ],
  },
];

const ArticlesList = () => {
  const articles = useArticleStore((state) => state.articles);
  const fetchArticles = useArticleStore((state) => state.fetchArticles);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(
    null
  );
  const doctor = useLoginStore((state) => state.doctor);
  const doctorId = doctor?._id;
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [articlesPerPage] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  useEffect(() => {
    const fetchAndSetArticles = async () => {
      setLoading(true);
      await fetchArticles();
      setLoading(false);
    };
    fetchAndSetArticles();
  }, [fetchArticles]);

  useEffect(() => {
    setTotalPages(Math.max(1, Math.ceil(articles.length / articlesPerPage)));
    setCurrentPage(1);
  }, [articles]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setCurrentPage(1);
    debouncedSearch(query);
  };

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      if (query.trim()) {
        fetchArticles({ title: { $regex: query, $options: "i" } });
      } else {
        fetchArticles();
      }
    }, 300),
    [fetchArticles]
  );

  const resetFilter = async () => {
    setSelectedCategory(null);
    setSelectedSubCategory(null);
    setSearchQuery("");
    await fetchArticles();
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleToggleCategory = (categoryName: string) => {
    if (expandedCategories.includes(categoryName)) {
      setExpandedCategories(
        expandedCategories.filter((name) => name !== categoryName)
      );
    } else {
      setExpandedCategories([...expandedCategories, categoryName]);
    }
  };

  const handleFilterSubCategory = async (subCategoryName: string) => {
    setSelectedSubCategory(subCategoryName);
    let selectedCategoryName = "";

    for (const category of categories) {
      const subCategory = category.subCategories.find(
        (sub) => sub.name === subCategoryName
      );
      if (subCategory) {
        selectedCategoryName = category.name;
        break;
      }
    }

    setSelectedCategory(selectedCategoryName);
    await fetchArticles({
      category: selectedCategoryName,
      subCategory: subCategoryName,
    });
  };

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

  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = articles.slice(
    indexOfFirstArticle,
    indexOfLastArticle
  );

  const hasActiveFilters =
    selectedCategory !== null ||
    selectedSubCategory !== null ||
    searchQuery !== "";

  return (
    <div className="min-h-screen mt-16 bg-gray-100">
      {/* Button and Search Section */}
      <div className="container mx-auto py-4 ">
        <div className="flex justify-between items-center mt-4">
          <div className="flex space-x-4 ">
            <button
              onClick={() => router.push(`/doctor/article-form/${doctorId}`)}
              className="flex items-center bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg shadow-md transition duration-300"
            >
              <FaPlus className="mr-2" /> Create Article
            </button>
            <button
              onClick={() => router.push("/doctor/myArticles")}
              className="flex items-center bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg shadow-md transition duration-300"
            >
              <FaBook className="mr-2" /> My Articles
            </button>
          </div>
          <div className="relative w-full max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search articles by title..."
              className="w-full px-4 py-2 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5 text-gray-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35M18.25 10.75a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-2">
        {/* Articles List */}
        <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
          {/* Articles Section */}
          <div className="w-full md:w-3/4">
            {loading ? (
              <div className="text-center text-lg font-semibold">
                Loading...
              </div>
            ) : currentArticles.length === 0 ? (
              <div className="text-center text-lg font-semibold">
                No articles found.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentArticles.map((article) => (
                  <div
                    key={article._id}
                    className="bg-white p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition duration-300"
                    onClick={() => handleArticleClick(article._id)}
                  >
                    {article.image && (
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                    )}
                    <h2 className="text-xl font-medium text-blue-700 mb-2">
                      {article.title}
                    </h2>
                    <div className="text-gray-500 text-sm mb-2">
                      {new Date(article.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                    <p className="text-gray-600">
                      {truncateHtmlContent(article.content, 100)}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8 space-x-2">
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className={`${
                    currentPage === 1
                      ? "bg-gray-200 cursor-not-allowed"
                      : "bg-teal-500 hover:bg-blue-700 text-white"
                  } py-2 px-4 rounded-lg font-semibold transition duration-300`}
                >
                  <MdKeyboardDoubleArrowLeft size={20} />
                </button>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`${
                    currentPage === 1
                      ? "bg-gray-200 cursor-not-allowed"
                      : "bg-teal-500 hover:bg-blue-700 text-white"
                  } py-2 px-4 rounded-lg font-semibold transition duration-300`}
                >
                  <MdKeyboardArrowLeft size={20} />
                </button>
                <div className="py-2 px-4 bg-gray-100 rounded-lg">
                  {currentPage} / {totalPages}
                </div>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`${
                    currentPage === totalPages
                      ? "bg-gray-200 cursor-not-allowed"
                      : "bg-teal-500 hover:bg-blue-700 text-white"
                  } py-2 px-4 rounded-lg font-semibold transition duration-300`}
                >
                  <MdKeyboardArrowRight size={20} />
                </button>
                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className={`${
                    currentPage === totalPages
                      ? "bg-gray-200 cursor-not-allowed"
                      : "bg-teal-500 hover:bg-blue-700 text-white"
                  } py-2 px-4 rounded-lg font-semibold transition duration-300`}
                >
                  <MdKeyboardDoubleArrowRight size={20} />
                </button>
              </div>
            )}
          </div>

          {/* Categories Sidebar */}
          <div className="w-full md:w-1/4 bg-white p-4 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-blue-700">
                Categories
              </h2>
              {hasActiveFilters && (
                <button
                  onClick={resetFilter}
                  className="bg-blue-400 hover:bg-blue-700 text-white py-1 px-2 rounded-lg shadow-md transition duration-300"
                >
                  Reset
                </button>
              )}
            </div>

            <div>
              {categories.map((category) => (
                <div key={category.name}>
                  <div
                    className="flex justify-between items-center cursor-pointer py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition"
                    onClick={() => handleToggleCategory(category.name)}
                  >
                    <span>{category.name}</span>
                    {expandedCategories.includes(category.name) ? (
                      <IoMdArrowDropdown />
                    ) : (
                      <IoMdArrowDropright />
                    )}
                  </div>
                  {expandedCategories.includes(category.name) && (
                    <div className="pl-4">
                      {category.subCategories.map((subCategory) => (
                        <div
                          key={subCategory.name}
                          className={`flex items-center cursor-pointer pl-4 py-1 text-gray-600 hover:bg-gray-200 rounded-lg transition ${
                            selectedSubCategory === subCategory.name
                              ? "bg-blue-100 font-semibold text-blue-700"
                              : ""
                          }`}
                          onClick={() =>
                            handleFilterSubCategory(subCategory.name)
                          }
                        >
                          <span>{subCategory.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticlesList;
