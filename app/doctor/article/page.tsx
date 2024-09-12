"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useArticleStore } from "@/store/useArticleStore";
import { debounce } from "@mui/material";
import { useRouter } from "next/navigation";
import { IoMdArrowDropdown, IoMdArrowDropright } from "react-icons/io";
import {
  MdCategory,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";
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
      // { name: "Hair Care Tips", imagePath: "/images/default.jpg" },
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
      // { name: "Dentist Visits", imagePath: "/images/default.jpg" },
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
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [articlesPerPage] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  const doctor = useLoginStore((state) => state.doctor);
  const doctorId = doctor?._id;
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
    router.push(`/patient/article/${id}`);
  };

  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = articles.slice(
    indexOfFirstArticle,
    indexOfLastArticle
  );

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="py-4 mt-16">
        {/* Search Bar and Buttons */}
        <div className="relative flex justify-between items-center px-6 border-b">
          <div className="flex space-x-2">
            <button
              onClick={() => router.push(`/doctor/article-form/${doctorId}`)}
              className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold transition duration-300"
            >
              Create Article
            </button>
            <button
              onClick={() => router.push("/doctor/myArticles")}
              className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-semibold transition duration-300"
            >
              My Articles
            </button>
          </div>
          {/* Search Bar */}
          <div className="relative w-full max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search articles by title..."
              className="w-full px-4 py-2 mb-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
            />
            <div className="absolute mb-4 inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              {/* Search Icon */}
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

          {/* Buttons */}
        </div>

        {/* Selected Category and Reset Button */}
        {selectedCategory && (
          <div className="mb-4 mt-2 px-16 text-xl font-semibold flex items-center justify-between w-full">
            <span>
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

      {/* Articles and Categories */}
      <div className="mx-auto p-6">
        <div className="flex justify-between px-2">
          {/* Articles Section */}
          {loading ? (
            <div className="text-center text-gray-700">Loading...</div>
          ) : articles.length === 0 ? (
            <div className="text-center text-gray-700">No articles found.</div>
          ) : (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 px-3 lg:grid-cols-2 gap-6">
                {currentArticles.map((article) => (
                  <div
                    key={article._id}
                    onClick={() => handleArticleClick(article._id)}
                    className="bg-white cursor-pointer rounded-lg overflow-hidden hover:bg-blue-100 transition duration-300"
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
                          __html: truncateHtmlContent(article.content, 100),
                        }}
                      ></p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex items-center space-x-2 justify-end mt-6">
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white disabled:bg-gray-400"
                >
                  <MdKeyboardDoubleArrowLeft />
                </button>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white disabled:bg-gray-400"
                >
                  <MdKeyboardArrowLeft />
                </button>

                {/* Previous Page Number */}
                {currentPage > 2 && (
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="w-10 h-10 flex items-center justify-center bg-gray-200 text-black"
                  >
                    {currentPage - 1}
                  </button>
                )}

                {/* Current Page Number */}
                <span className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white">
                  {currentPage}
                </span>

                {/* Next Page Number */}
                {currentPage < totalPages - 1 && (
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="w-10 h-10 flex items-center justify-center bg-gray-200 text-black"
                  >
                    {currentPage + 1}
                  </button>
                )}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white disabled:bg-gray-400"
                >
                  <MdKeyboardArrowRight />
                </button>
                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white disabled:bg-gray-400"
                >
                  <MdKeyboardDoubleArrowRight />
                </button>
              </div>
            </div>
          )}

          {/* Categories Section */}
          <div className="px-6 w-2/5 border rounded-md">
            <h2 className="text-center mt-3 border-b pb-1 text-xl border-black mb-6">
              Our Categories...
            </h2>
            {categories.map((category) => (
              <div key={category.name} className="mb-4">
                {/* Category Item */}
                <div
                  className={`flex font-semibold text-lg cursor-pointer p-2 rounded-lg 
                    ${
                      selectedCategory === category.name
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-700"
                    }
                    hover:bg-blue-200 hover:text-blue-900 transition-all duration-200`}
                  onClick={() => handleToggleCategory(category.name)}
                >
                  {/* Arrow Icon */}
                  <div className="mt-1 text-xl mr-2">
                    {expandedCategories.includes(category.name) ? (
                      <IoMdArrowDropdown />
                    ) : (
                      <IoMdArrowDropright />
                    )}
                  </div>
                  {category.name}
                </div>
                {expandedCategories.includes(category.name) && (
                  <div className="flex flex-col mt-2 ml-6">
                    {category.subCategories.map((subCategory) => (
                      <div
                        key={subCategory.name}
                        className={`flex items-center cursor-pointer text-left pl-4 py-1 rounded-lg
                          ${
                            selectedSubCategory === subCategory.name
                              ? "bg-green-500 text-white"
                              : "bg-gray-100 text-gray-700"
                          }
                          hover:bg-green-200 hover:text-green-900 transition-all duration-200`}
                        onClick={() =>
                          handleFilterSubCategory(subCategory.name)
                        }
                      >
                        <MdCategory className="mr-2 text-gray-600" />
                        {subCategory.name}
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
  );
};

export default ArticlesList;

// "use client";
// import React, { useCallback, useEffect, useRef, useState } from "react";
// import { useArticleStore } from "@/store/useArticleStore";
// import { debounce } from "@mui/material";
// import { useRouter } from "next/navigation";
// import { IoMdArrowDropdown, IoMdArrowDropright } from "react-icons/io";
// import {
//   MdCategory,
//   MdKeyboardArrowLeft,
//   MdKeyboardArrowRight,
//   MdKeyboardDoubleArrowLeft,
//   MdKeyboardDoubleArrowRight,
//   MdLabel,
// } from "react-icons/md";

// interface Article {
//   _id: string;
//   title: string;
//   content: string;
//   image?: string;
//   category: string;
//   subCategory: string;
//   doctor?: {
//     name: string;
//   };
//   createdAt: Date;
// }
// const categories = [
//   {
//     name: "Healthy Hair",
//     subCategories: [
//       { name: "Hair Growth", imagePath: "/images/hairGrowth.jfif" },
//       { name: "Hair Loss Prevention", imagePath: "/images/hairLoss.jfif" },
//       // { name: "Hair Care Tips", imagePath: "/images/default.jpg" },
//       { name: "Scalp Treatments", imagePath: "/images/scalp-treatment.jpg" },
//       { name: "Hair Coloring", imagePath: "/images/hairColor.jfif" },
//     ],
//   },
//   {
//     name: "Healthy Skin",
//     subCategories: [
//       { name: "Acne Treatment", imagePath: "/images/acane.jfif" },
//       { name: "Anti-Aging", imagePath: "/images/anti-aging.jfif" },
//       { name: "Skin Hydration", imagePath: "/images/skin hydration.jfif" },
//       { name: "Sun Protection", imagePath: "/images/sun protection.jfif" },
//       { name: "Skin Brightening", imagePath: "/images/skin-brightning.jpg" },
//     ],
//   },
//   {
//     name: "Healthy Diet",
//     subCategories: [
//       { name: "Balanced Nutrition", imagePath: "/images/balance-diet.jpg" },
//       { name: "Weight Management", imagePath: "/images/weight-manegement.jpg" },
//       { name: "Detox Diet", imagePath: "/images/detox-diet.jpg" },
//       { name: "Meal Planning", imagePath: "/images/meal-planning.jpg" },
//       {
//         name: "Nutritional Supplements",
//         imagePath: "/images/nutrient-suppliment.jpg",
//       },
//     ],
//   },
//   {
//     name: "Healthy Teeth",
//     subCategories: [
//       { name: "Brushing Techniques", imagePath: "/images/brushing.jpg" },
//       { name: "Flossing Tips", imagePath: "/images/flossingtips.jpg" },
//       { name: "Oral Hygiene", imagePath: "/images/27503.jpg" },
//       { name: "Teeth Whitening", imagePath: "/images/whitning.jpg" },
//       // { name: "Dentist Visits", imagePath: "/images/default.jpg" },
//     ],
//   },
//   {
//     name: "General Health",
//     subCategories: [
//       { name: "Immunity Boost", imagePath: "/images/3985459.jpg" },
//       { name: "Injury care", imagePath: "/images/injurysaf.jpg" },
//       { name: "Healthy Digestion", imagePath: "/images/9344789.jpg" },
//       { name: "Periods Care", imagePath: "/images/periods.jpg" },
//       { name: "Sleep Better", imagePath: "/images/sleeping.jpg" },
//     ],
//   },
//   {
//     name: "Fitness & Exercise",
//     subCategories: [
//       { name: "Cardio Workouts", imagePath: "/images/cardio-workout.jpg" },
//       { name: "Strength Training", imagePath: "/images/strength-training.jpg" },
//       { name: "Meditation", imagePath: "/images/meditation.jpg" },
//       { name: "Everyday Fitness", imagePath: "/images/everyday-fitness.jpg" },
//       { name: "Yoga", imagePath: "/images/yoga.jpg" },
//     ],
//   },
//   {
//     name: "Pain Management",
//     subCategories: [
//       { name: "Back Pain", imagePath: "/images/back-pain.jpg" },
//       { name: "Neck Pain", imagePath: "/images/neck-pain.jpg" },
//       { name: "Headache", imagePath: "/images/headache.jfif" },
//       { name: "Knee Pain", imagePath: "/images/kneePain.jfif" },
//       { name: "Physical Therapy", imagePath: "/images/physicalTherapy.jfif" },
//     ],
//   },
//   {
//     name: "Mental Well-being",
//     subCategories: [
//       { name: "Stress Reduction", imagePath: "/images/stressReduction.jfif" },
//       { name: "Depression Management", imagePath: "/images/depression.jfif" },
//       { name: "Addiction", imagePath: "/images/addiction.jfif" },
//       { name: "Counseling", imagePath: "/images/councelling.jfif" },
//       { name: "Emotional Support", imagePath: "/images/emotionalSupport.jfif" },
//       { name: "Anger Manegment", imagePath: "/images/angerManagement.jfif" },
//     ],
//   },
//   {
//     name: "Kids & Parenting",
//     subCategories: [
//       { name: "Child Development", imagePath: "/images/childDevelopment.jpg" },
//       { name: "Parenting", imagePath: "/images/parenting.jpg" },
//       {
//         name: "Childhood Nutrition",
//         imagePath: "/images/nutrient-suppliment.jpg",
//       },
//       { name: "During/After Pregnancy", imagePath: "/images/pregnancy.jpg" },
//       {
//         name: "Positive Discipline",
//         imagePath: "/images/positiveattitude.jpg",
//       },
//     ],
//   },
// ];

// const ArticlesList = () => {
//   const articles = useArticleStore((state) => state.articles);
//   const fetchArticles = useArticleStore((state) => state.fetchArticles);
//   const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
//   const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
//   const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(
//     null
//   );
//   const [searchQuery, setSearchQuery] = useState<string>("");
//   const [groupByCategory, setGroupByCategory] = useState(false);

//   const [loading, setLoading] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [articlesPerPage] = useState(6);
//   const [totalPages, setTotalPages] = useState(1);
//   const dropdownRef = useRef<HTMLDivElement>(null);
//   const router = useRouter();

//   useEffect(() => {
//     const fetchAndSetArticles = async () => {
//       setLoading(true);
//       await fetchArticles();
//       setLoading(false);
//     };
//     fetchAndSetArticles();
//   }, [fetchArticles]);

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target as Node)
//       ) {
//         // setExpandCategories(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const handleToggleCategory = (categoryName: string) => {
//     // Toggle the category expanded state
//     if (expandedCategories.includes(categoryName)) {
//       setExpandedCategories(
//         expandedCategories.filter((name) => name !== categoryName)
//       );
//     } else {
//       setExpandedCategories([...expandedCategories, categoryName]);
//     }
//   };

//   function truncateHtmlContent(html: string, maxLength: number): string {
//     const div = document.createElement("div");
//     div.innerHTML = html;
//     let truncatedText = "";
//     let totalLength = 0;
//     const childNodesArray = Array.from(div.childNodes) as HTMLElement[];
//     for (let child of childNodesArray) {
//       const childText = child.textContent || child.innerText || "";
//       totalLength += childText.length;

//       if (totalLength > maxLength) {
//         const remainingLength = maxLength - (totalLength - childText.length);
//         truncatedText += childText.slice(0, remainingLength) + "...";
//         break;
//       } else {
//         truncatedText += child.outerHTML || child.nodeValue;
//       }
//     }

//     return truncatedText;
//   }
//   const handleArticleClick = async (id: string) => {
//     router.push(`/patient/article/${id}`);
//   };
//   const resetFilter = async () => {
//     setSelectedCategory(null);
//     await fetchArticles();
//   };

//   const debouncedSearch = useCallback(
//     debounce((query: string) => {
//       if (query.trim()) {
//         fetchArticles({ title: { $regex: query, $options: "i" } });
//       } else {
//         fetchArticles();
//       }
//     }, 300),
//     [fetchArticles]
//   );

//   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const query = e.target.value;
//     setSearchQuery(query);
//     setCurrentPage(1);
//     debouncedSearch(query);
//   };

//   const handleFilterSubCategory = async (subCategoryName: string) => {
//     setSelectedSubCategory(subCategoryName);
//     let selectedCategory = "";

//     for (const category of categories) {
//       const subCategory = category.subCategories.find(
//         (sub) => sub.name === subCategoryName
//       );
//       if (subCategory) {
//         selectedCategory = category.name;
//         break;
//       }
//     }

//     setSelectedCategory(selectedCategory);
//     await fetchArticles({
//       category: selectedCategory,
//       subCategory: subCategoryName,
//     });
//     setGroupByCategory(false);
//   };
//   useEffect(() => {
//     setTotalPages(Math.max(1, Math.ceil(articles.length / articlesPerPage)));
//     setCurrentPage(1);
//   }, [articles]);
//   const indexOfLastArticle = currentPage * articlesPerPage;
//   const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
//   const currentArticles = articles.slice(
//     indexOfFirstArticle,
//     indexOfLastArticle
//   );

//   const handlePageChange = (newPage: number) => {
//     setCurrentPage(newPage);
//   };
//   return (
//     <div className="bg-gray-100 min-h-screen">
//       <div className="py-4 mt-16">
//         <div className="relative flex justify-end space-x-4 pr-6 border-b">

//           <div className="relative w-full max-w-md">
//             <input
//               type="text"
//               value={searchQuery}
//               onChange={handleSearchChange}
//               placeholder="Search articles by title..."
//               className="w-full px-4 py-2 mb-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
//             />
//             <div className="absolute mb-4 inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 strokeWidth={2}
//                 stroke="currentColor"
//                 className="w-5 h-5 text-gray-400"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="M21 21l-4.35-4.35M18.25 10.75a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z"
//                 />
//               </svg>
//             </div>
//           </div>
//         </div>
//         {selectedCategory && (
//           <div className="mb-4 mt-2 px-16 text-xl font-semibold flex items-center justify-between w-full">
//             <span>
//               {/* Filtering by:{" "} */}
//               <span className="text-gray-700">
//                 {selectedCategory && selectedSubCategory
//                   ? `${selectedCategory} > ${selectedSubCategory}`
//                   : selectedCategory}
//               </span>
//             </span>
//             <button
//               onClick={resetFilter}
//               className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-semibold transition duration-300"
//             >
//               Reset
//             </button>
//           </div>
//         )}
//       </div>
//       <div className="mx-auto p-6">
//         <div className="flex justify-between px-2">
//           {loading ? (
//             <div className="text-center text-gray-700">Loading...</div>
//           ) : articles.length === 0 ? (
//             <div className="text-center text-gray-700">No articles found.</div>
//           ) : (
//             <div>
//               <div className="grid grid-cols-1 md:grid-cols-2 px-3 lg:grid-cols-2 gap-6">
//                 {currentArticles.map((article) => (
//                   <div
//                     key={article._id}
//                     onClick={() => handleArticleClick(article._id)}
//                     className="bg-white cursor-pointer rounded-lg overflow-hidden hover:bg-blue-100 transition duration-300"
//                   >
//                     {/* Image Section */}
//                     <div className="relative w-full h-60 overflow-hidden rounded-t-lg">
//                       <img
//                         src={article.image || "/images/default.jpg"}
//                         alt={article.title}
//                         className="object-cover w-full h-full"
//                       />
//                     </div>
//                     <div className="p-6">
//                       <h3 className="text-lg font-bold text-gray-900 mb-2">
//                         {article.title}
//                       </h3>
//                       <div className="text-sm text-gray-500 mb-2">
//                         <p>
//                           By:{" "}
//                           <span className="font-semibold text-gray-700">
//                             Dr. {article?.doctor?.name || "Unknown"}
//                           </span>
//                         </p>
//                         <p>
//                           Published on:{" "}
//                           <span className="font-semibold text-gray-700">
//                             {new Date(article.createdAt).toLocaleDateString(
//                               "en-GB",
//                               {
//                                 day: "2-digit",
//                                 month: "short",
//                                 year: "numeric",
//                               }
//                             )}
//                           </span>
//                         </p>
//                       </div>
//                       <p
//                         className="text-gray-700"
//                         dangerouslySetInnerHTML={{
//                           __html: truncateHtmlContent(article.content, 100),
//                         }}
//                       ></p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//               <div className="flex items-center space-x-2 justify-end mt-6">
//                 <button
//                   onClick={() => handlePageChange(1)}
//                   disabled={currentPage === 1}
//                   className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white disabled:bg-gray-400"
//                 >
//                   <MdKeyboardDoubleArrowLeft />
//                 </button>
//                 <button
//                   onClick={() => handlePageChange(currentPage - 1)}
//                   disabled={currentPage === 1}
//                   className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white disabled:bg-gray-400"
//                 >
//                   <MdKeyboardArrowLeft />
//                 </button>

//                 {/* Display previous page number if it exists */}
//                 {currentPage > 2 && (
//                   <button
//                     onClick={() => handlePageChange(currentPage - 1)}
//                     className="w-10 h-10 flex items-center justify-center bg-gray-200 text-black"
//                   >
//                     {currentPage - 1}
//                   </button>
//                 )}

//                 {/* Display current page number */}
//                 <span className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white">
//                   {currentPage}
//                 </span>

//                 {/* Display next page number if it exists */}
//                 {currentPage < totalPages - 1 && (
//                   <button
//                     onClick={() => handlePageChange(currentPage + 1)}
//                     className="w-10 h-10 flex items-center justify-center bg-gray-200 text-black"
//                   >
//                     {currentPage + 1}
//                   </button>
//                 )}

//                 <button
//                   onClick={() => handlePageChange(currentPage + 1)}
//                   disabled={currentPage === totalPages}
//                   className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white disabled:bg-gray-400"
//                 >
//                   <MdKeyboardArrowRight />
//                 </button>
//                 <button
//                   onClick={() => handlePageChange(totalPages)}
//                   disabled={currentPage === totalPages}
//                   className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white disabled:bg-gray-400"
//                 >
//                   <MdKeyboardDoubleArrowRight />
//                 </button>
//               </div>
//             </div>
//           )}
//           <div className="px-6 w-2/5 border rounded-md">
//             <h2 className="text-center mt-3 border-b pb-1 text-xl border-black mb-6">
//               Our Categories...
//             </h2>
//             {categories.map((category) => (
//               <div key={category.name} className="mb-4">
//                 {/* Category Item */}
//                 <div
//                   className={`flex font-semibold text-lg cursor-pointer p-2 rounded-lg
//                   ${
//                     selectedCategory === category.name
//                       ? "bg-blue-500 text-white"
//                       : "bg-gray-100 text-gray-700"
//                   }
//                   hover:bg-blue-200 hover:text-blue-900 transition-all duration-200`}
//                   onClick={() => handleToggleCategory(category.name)}
//                 >
//                   {/* Arrow Icon */}
//                   <div className="mt-1 text-xl mr-2">
//                     {expandedCategories.includes(category.name) ? (
//                       <IoMdArrowDropdown />
//                     ) : (
//                       <IoMdArrowDropright />
//                     )}
//                   </div>
//                   {category.name}
//                 </div>
//                 {expandedCategories.includes(category.name) && (
//                   <div className="flex flex-col mt-2 ml-6">
//                     {category.subCategories.map((subCategory) => (
//                       <div
//                         key={subCategory.name}
//                         className={`flex items-center cursor-pointer text-left pl-4 py-1 rounded-lg
//                                     ${
//                                       selectedSubCategory === subCategory.name
//                                         ? "bg-green-500 text-white"
//                                         : "bg-gray-100 text-gray-700"
//                                     }
//                                     hover:bg-green-200 hover:text-green-900 transition-all duration-200`}
//                         onClick={() =>
//                           handleFilterSubCategory(subCategory.name)
//                         }
//                       >
//                         <MdCategory className="mr-2 text-gray-600" />
//                         {subCategory.name}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ArticlesList;
