"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useArticleStore } from "@/store/useArticleStore";
import { debounce } from "@mui/material";

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
      { name: "Hair Care Tips", imagePath: "/images/default.jpg" },
      { name: "Scalp Treatments", imagePath: "/images/default.jpg" },
      { name: "Hair Coloring", imagePath: "/images/hairColor.jfif" },
    ],
  },
  {
    name: "Healthy Skin",
    subCategories: [
      { name: "Acne Treatment", imagePath: "/images/acane.jfif" },
      { name: "Anti-Aging", imagePath: "/images/anti-aging.jfif" },
      { name: "Skin Hydration", imagePath: "/images/skin hydration.jfif" },
      { name: "Sun Protection", imagePath: "/images/default.jpg" },
      { name: "Skin Brightening", imagePath: "/images/default.jpg" },
    ],
  },
  {
    name: "Healthy Diet",
    subCategories: [
      { name: "Balanced Nutrition", imagePath: "/images/default.jpg" },
      { name: "Weight Management", imagePath: "/images/default.jpg" },
      { name: "Detox Diet", imagePath: "/images/default.jpg" },
      { name: "Meal Planning", imagePath: "/images/default.jpg" },
      { name: "Nutritional Supplements", imagePath: "/images/default.jpg" },
    ],
  },
  {
    name: "Healthy Teeth",
    subCategories: [
      { name: "Brushing Techniques", imagePath: "/images/default.jpg" },
      { name: "Flossing Tips", imagePath: "/images/default.jpg" },
      { name: "Oral Hygiene", imagePath: "/images/default.jpg" },
      { name: "Teeth Whitening", imagePath: "/images/default.jpg" },
      { name: "Dentist Visits", imagePath: "/images/default.jpg" },
    ],
  },
  {
    name: "General Health",
    subCategories: [
      { name: "Immunity Boost", imagePath: "/images/default.jpg" },
      { name: "Disease Prevention", imagePath: "/images/default.jpg" },
      { name: "Detox", imagePath: "/images/default.jpg" },
      { name: "Healthy Aging", imagePath: "/images/default.jpg" },
      { name: "Stress Management", imagePath: "/images/default.jpg" },
    ],
  },
  {
    name: "Fitness & Exercise",
    subCategories: [
      { name: "Cardio Workouts", imagePath: "/images/default.jpg" },
      { name: "Strength Training", imagePath: "/images/default.jpg" },
      { name: "Flexibility Exercises", imagePath: "/images/default.jpg" },
      { name: "Workout Routines", imagePath: "/images/default.jpg" },
      { name: "Recovery Techniques", imagePath: "/images/default.jpg" },
    ],
  },
  {
    name: "Pain Management",
    subCategories: [
      { name: "Chronic Pain Relief", imagePath: "/images/default.jpg" },
      { name: "Acute Pain Management", imagePath: "/images/default.jpg" },
      { name: "Alternative Therapies", imagePath: "/images/default.jpgg" },
      { name: "Pain Medication", imagePath: "/images/default.jpg" },
      { name: "Physical Therapy", imagePath: "/images/default.jpg" },
    ],
  },
  {
    name: "Mental Well-being",
    subCategories: [
      { name: "Stress Reduction", imagePath: "/images/default.jpg" },
      { name: "Depression Management", imagePath: "/images/default.jpg" },
      { name: "Mindfulness Practices", imagePath: "/images/default.jpg" },
      { name: "Counseling", imagePath: "/images/default.jpg" },
      { name: "Emotional Support", imagePath: "/images/default.jpg" },
    ],
  },
  {
    name: "Kids & Parenting",
    subCategories: [
      { name: "Child Development", imagePath: "/images/default.jpg" },
      { name: "Parenting Tips", imagePath: "/images/default.jpg" },
      { name: "Family Health", imagePath: "/images/default.jpg" },
      { name: "Early Education", imagePath: "/images/default.jp" },
      { name: "Positive Discipline", imagePath: "/images/default.jpg" },
    ],
  },
];

const ArticlesList = () => {
  const articles = useArticleStore((state) => state.articles);
  const fetchArticles = useArticleStore((state) => state.fetchArticles);
  const [expandCategories, setExpandCategories] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [groupByCategory, setGroupByCategory] = useState(false);

  const [loading, setLoading] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const allCategories = [
    "Skin & Hair Care",
    "Healthy Teeth",
    "General Health",
    "Fitness & Exercise",
    "Healthy Hair",
    "Healthy Skin",
    "Healthy Diet",
  ];

  useEffect(() => {
    const fetchAndSetArticles = async () => {
      setLoading(true);
      await fetchArticles();
      setLoading(false);
    };
    fetchAndSetArticles();
  }, [fetchArticles]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setExpandCategories(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    fetchArticles({ category });
    setExpandCategories(false);
  };

  const resetFilter = async () => {
    setSelectedCategory(null);
    await fetchArticles();
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const handleGroupByCategoryClick = () => {
    setGroupByCategory(!groupByCategory);
  };

  const handleFilterSubCategory = async (subCategoryName: string) => {
    setSelectedSubCategory(subCategoryName);
    let selectedCategory = "";

    for (const category of categories) {
      const subCategory = category.subCategories.find(
        (sub) => sub.name === subCategoryName
      );
      if (subCategory) {
        selectedCategory = category.name;
        break;
      }
    }

    setSelectedCategory(selectedCategory);
    await fetchArticles({
      category: selectedCategory,
      subCategory: subCategoryName,
    });
    setGroupByCategory(false);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="py-4 mt-16">
        <div className="relative flex justify-end space-x-4 pr-6 border-b">
          <div className="relative flex items-center" ref={dropdownRef}>
            <button
              onClick={() => setExpandCategories(!expandCategories)}
              className={`text-gray-700 hover:text-blue-700 mb-4 py-2 px-4 font-semibold transition duration-300 flex items-center ${
                expandCategories ? "border-b-2 border-blue-600" : ""
              }`}
              aria-label="Explore categories"
            >
              Explore
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 320 512"
                width="16"
                height="16"
                fill="currentColor"
                className="ml-1"
              >
                <path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z" />
              </svg>
            </button>

            {expandCategories && (
              <div className="absolute top-8 left-6 mt-2 w-64 bg-white text-gray-800 rounded-lg shadow-lg z-50">
                {allCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryClick(category)}
                    className="block w-full text-left py-2 px-4 hover:bg-gray-100 transition duration-200"
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="relative flex items-center">
            <button
              onClick={handleGroupByCategoryClick}
              className={`text-gray-700 mb-4 hover:text-blue-700 py-2 px-4 font-semibold transition duration-300 flex items-center ${
                groupByCategory ? "border-b-2 border-blue-600" : ""
              }`}
              aria-label="Group by category"
            >
              {"Group by Category"}
            </button>
          </div>
          <div className="relative w-full max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search articles by title..."
              className="w-full px-4 py-2 mb-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
            />
            <div className="absolute mb-4 inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
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
        {selectedCategory && (
          <div className="mb-4 mt-2 px-16 text-xl font-semibold flex items-center justify-between w-full">
            <span>
              {/* Filtering by:{" "} */}
              <span className="text-gray-700">
                {selectedCategory && selectedSubCategory
                  ? `${selectedCategory} > ${selectedSubCategory}`
                  : selectedCategory}
              </span>
            </span>
            <button
              onClick={resetFilter}
              className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-semibold transition duration-300"
            >
              Reset
            </button>
          </div>
        )}
      </div>
      <div className="mx-auto p-6">
        {loading ? (
          <div className="text-center text-gray-700">Loading...</div>
        ) : articles.length === 0 ? (
          <div className="text-center text-gray-700">No articles found.</div>
        ) : (
          <div className="space-y-8">
            {groupByCategory ? (
              categories.map((category) => (
                <div>
                  <div key={category.name} className="font-semibold text-lg">
                    {category.name}
                  </div>
                  <div className="flex ml-16 mt-2 justify-start items-center space-x-8">
                    {category.subCategories.map((subCategory) => (
                      <div
                        key={subCategory.name}
                        className="cursor-pointer w-1/12 h-20 p-2 text-center items-center"
                        onClick={() =>
                          handleFilterSubCategory(subCategory.name)
                        }
                      >
                        <img src={subCategory.imagePath} />
                        {subCategory.name}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article) => (
                  <div
                    key={article._id}
                    className="bg-white rounded-lg overflow-hidden shadow-lg hover:bg-blue-100 transition duration-300"
                  >
                    {/* Image Section */}
                    <div className="relative w-full h-60 overflow-hidden rounded-t-lg">
                      <img
                        src={article.image || "/images/default.jpg"}
                        alt={article.title}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {article.title}
                      </h3>
                      <div className="text-sm text-gray-500 mb-2">
                        <p>
                          By:{" "}
                          <span className="font-semibold text-gray-700">
                            Dr. {article?.doctor?.name || "Unknown"}
                          </span>
                        </p>
                        <p>
                          Published on:{" "}
                          <span className="font-semibold text-gray-700">
                            {new Date(article.createdAt).toLocaleDateString()}
                          </span>
                        </p>
                      </div>
                      <p
                        className="text-gray-700"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                      ></p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticlesList;
