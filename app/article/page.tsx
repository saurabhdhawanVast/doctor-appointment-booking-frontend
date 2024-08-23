"use client"; 
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Article {
  _id: string;
  title: string;
  content: string;
  category: string;
  subCategory: string;
  doctor: {
    name: string;
  };
  createdAt: string;
}

const ArticlesList: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [expandCategories, setExpandCategories] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const primaryCategories = ['Healthy Hair', 'Healthy Skin', 'Healthy Diet'];
  const allCategories = [
    'Skin & Hair Care',
    'Healthy Teeth',
    'General Health',
    'Fitness & Exercise',
    ...primaryCategories,
  ];

  useEffect(() => {
    axios.get('http://localhost:5000/articles')
      .then(response => {
        setArticles(response.data);
        setFilteredArticles(response.data);
      })
      .catch(error => {
        console.error('Error fetching articles:', error);
      });
  }, []);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    const filtered = articles.filter(article => article.category === category);
    setFilteredArticles(filtered);
    setExpandCategories(false);  // Hide categories after selection
  };

  const resetFilter = () => {
    setSelectedCategory(null);
    setFilteredArticles(articles);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Filter Navbar */}
      {!selectedCategory && (
        <div className="bg-blue-600 text-white py-4 mt-16 shadow-lg">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-extrabold">Filter Articles</h1>
            <div className="flex space-x-4">
              {primaryCategories.map(category => (
                <button
                  key={category}
                  onClick={() => handleCategoryClick(category)}
                  className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold transition duration-300"
                >
                  {category}
                </button>
              ))}
              <div className="relative">
                <button
                  onClick={() => setExpandCategories(!expandCategories)}
                  className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold transition duration-300"
                >
                  Expand
                </button>
                {expandCategories && (
                  <div className="absolute right-0 mt-2 w-64 bg-white text-gray-800 rounded-lg shadow-lg z-50">
                    {allCategories.map(category => (
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
            </div>
          </div>
        </div>
      )}

      {/* Articles List */}
      <div className="container mx-auto p-6">
        {selectedCategory && (
          <div className="mb-4 text-xl font-semibold flex items-center justify-between">
            <span>Filtering by: <span className="text-blue-600">{selectedCategory}</span></span>
            <button
              onClick={resetFilter}
              className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-semibold transition duration-300"
            >
              Reset Filter
            </button>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map(article => (
            <div key={article._id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300">
              <h2 className="text-2xl font-extrabold text-gray-900 mb-4">{article.title}</h2>
              <div className="text-sm text-gray-500 mb-4">
                <p>By: <span className="font-semibold text-gray-700">Dr. {article.doctor.name}</span></p>
                <p>Published on: <span className="font-semibold text-gray-700">{new Date(article.createdAt).toLocaleDateString()}</span></p>
              </div>
              <div className="prose max-w-none mb-6 text-justify text-gray-700">
                <div dangerouslySetInnerHTML={{ __html: article.content }} />
              </div>
              <div className="text-sm text-gray-500">
                <p>Category: <span className="font-semibold text-gray-700">{article.category}</span></p>
                <p>SubCategory: <span className="font-semibold text-gray-700">{article.subCategory}</span></p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArticlesList;


// "use client"; 
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// interface Article {
//   _id: string;
//   title: string;
//   content: string;
//   category: string;
//   subCategory: string;
//   doctor: {
//     name: string;
//   };
//   createdAt: string;
// }

// const ArticlesList: React.FC = () => {
//   const [articles, setArticles] = useState<Article[]>([]);

//   useEffect(() => {
//     axios.get('http://localhost:5000/articles')
//       .then(response => {
//         setArticles(response.data);
//       })
//       .catch(error => {
//         console.error('Error fetching articles:', error);
//       });
//   }, []);

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-4xl font-bold text-center mb-8">Articles</h1>
//       <div className="space-y-8">
//         {articles.map(article => (
//           <div key={article._id} className="bg-white p-8 rounded-lg shadow-md">
//             <h2 className="text-3xl font-bold text-gray-900 mb-4">{article.title}</h2>
//             <div className="text-sm text-gray-500 mb-6">
//               <p>By: <span className="font-medium text-gray-700">Dr. {article.doctor.name}</span></p>
//               <p>Published on: <span className="font-medium text-gray-700">{new Date(article.createdAt).toLocaleDateString()}</span></p>
//             </div>
//             <div className="prose max-w-none mb-6">
//               <div dangerouslySetInnerHTML={{ __html: article.content }} />
//             </div>
//             <div className="text-sm text-gray-500">
//               <p>Category: <span className="font-medium text-gray-700">{article.category}</span></p>
//               <p>SubCategory: <span className="font-medium text-gray-700">{article.subCategory}</span></p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ArticlesList;


