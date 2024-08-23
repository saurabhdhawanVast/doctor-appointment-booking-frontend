"use client"; 
import React, { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useRouter, useParams } from 'next/navigation';
import { toast } from "react-toastify";
import { useArticleStore } from '@/store/useArticleStore';

const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

const CreateArticleForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');   
  const [redirect, setRedirect] = useState(false);
  const editor = useRef(null);
  const router = useRouter();
  const params = useParams();
  const createArticle = useArticleStore(state => state.createArticle);

  const doctorId = Array.isArray(params?.doctorId) ? params.doctorId[0] : params?.doctorId;

  const categories = [
    'Healthy Hair',
    'Healthy Skin',
    'Healthy Diet',
    'Healthy Teeth',
    'General Health',
    'Fitness & Exercise',
    'Pain Management',
    'Mental well-being',
    'Kids & Parenting',
  ];

  const subCategoryArrray = [
    'Healthy Hair',
    'Healthy Skin',
    'Healthy Diet',
    'Healthy Teeth',
    'General Health',
    'Fitness & Exercise',
    'Pain Management',
    'Mental well-being',
    'Kids & Parenting',
  ];

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      createArticle({
        title,
        content,
        category,
        subCategory,
        doctorId,
      });
      toast.success("Article Created Successfully!");
      setRedirect(true);
    } catch (error) {
      console.error('Error creating article:', error);
      toast.error("Error creating Article");
    }
  };

  if (redirect) {
    router.back();
    return null;
  }

  return (
    <div className="mt-10 flex justify-center px-4">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Create Article</h1>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">Title:</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            className="shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">Content:</label>
          <JoditEditor
            ref={editor}
            value={content}
            config={{
              readonly: false,
              removeButtons: ['speechRecognition'],
            }}
            onChange={newContent => setContent(newContent)}
            className="border rounded w-full p-2"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">Category:</label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            required
            className="shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select a Category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">SubCategory:</label>
          <input
            type="text"
            value={subCategory}
            onChange={e => setSubCategory(e.target.value)}
            required
            className="shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline transition ease-in-out duration-300"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateArticleForm;


// "use client"; 
// import React, { useState, useRef } from 'react';
// import dynamic from 'next/dynamic';
// import { useRouter, useParams } from 'next/navigation';
// import { toast } from "react-toastify";
// import { useArticleStore } from '@/store/useArticleStore';

// const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

// const CreateArticleForm: React.FC = () => {
//   const [title, setTitle] = useState('');
//   const [content, setContent] = useState('');
//   const [category, setCategory] = useState('');
//   const [subCategory, setSubCategory] = useState('');   
//   const [redirect, setRedirect] = useState(false);
//   const editor = useRef(null);
//   const router = useRouter();
//   const params = useParams();
//   const createArticle = useArticleStore(state => state.createArticle);

//   const doctorId = Array.isArray(params?.doctorId) ? params.doctorId[0] : params?.doctorId;

//   const handleSubmit = async (event: React.FormEvent) => {
//     event.preventDefault();

//     try {
//       createArticle({
//         title,
//         content,
//         category,
//         subCategory,
//         doctorId,
//       });
//       toast.success("Article Created Successfully!");
//       setRedirect(true);
//     } catch (error) {
//       console.error('Error creating article:', error);
//       toast.error("Error creating Article");
//     }
//   };

//   if (redirect) {
//     router.back();
//     return null;
//   }

//   return (
//     <div className="mt-10 flex justify-center px-4">
//       <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl">
//         <h1 className="text-3xl font-bold mb-6 text-center">Create Article</h1>
//         <div className="mb-6">
//           <label className="block text-gray-700 text-sm font-bold mb-2">Title:</label>
//           <input
//             type="text"
//             value={title}
//             onChange={e => setTitle(e.target.value)}
//             required
//             className="shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//           />
//         </div>
//         <div className="mb-6">
//           <label className="block text-gray-700 text-sm font-bold mb-2">Content:</label>
//           <JoditEditor
//             ref={editor}
//             value={content}
//             config={{
//               readonly: false,
//               removeButtons: ['speechRecognition'],
//             }}
//             onChange={newContent => setContent(newContent)}
//             className="border rounded w-full p-2"
//           />
//         </div>
//         <div className="mb-6">
//           <label className="block text-gray-700 text-sm font-bold mb-2">Category:</label>
//           <input
//             type="text"
//             value={category}
//             onChange={e => setCategory(e.target.value)}
//             required
//             className="shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//           />
//         </div>
//         <div className="mb-6">
//           <label className="block text-gray-700 text-sm font-bold mb-2">SubCategory:</label>
//           <input
//             type="text"
//             value={subCategory}
//             onChange={e => setSubCategory(e.target.value)}
//             required
//             className="shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//           />
//         </div>
//         <div className="flex items-center justify-between">
//           <button
//             type="submit"
//             className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline transition ease-in-out duration-300"
//           >
//             Submit
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default CreateArticleForm;


// "use client";
// import React, { useState, useRef } from 'react';
// import dynamic from 'next/dynamic';
// import axios from 'axios';
// import { useRouter, useParams } from 'next/navigation';
// import { toast } from "react-toastify";
// import { useArticleStore } from '@/store/useArticleStore';

// const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

// const CreateArticleForm: React.FC = () => {
//   const [title, setTitle] = useState('');
//   const [content, setContent] = useState('');
//   const [category, setCategory] = useState('');
//   const [subCategory, setSubCategory] = useState('');   
//   const [redirect, setRedirect] = useState(false);
//   const editor = useRef(null);
//   const router = useRouter();
//   const params = useParams();
//   const createArticle = useArticleStore(state=>state.createArticle)

//   const doctorId = Array.isArray(params?.doctorId) ? params.doctorId[0] : params?.doctorId;;

//   console.log('Doctor ID:', doctorId);

//   const handleSubmit = async (event: React.FormEvent) => {
//     event.preventDefault();
//     console.log("Form submission started"); 
//     console.log('Submitting data:', {
//       title,
//       content,
//       category,
//       subCategory,
//       doctorId,
//     });

//     try {
//       createArticle({
//         title,
//         content,
//         category,
//         subCategory,
//         doctorId,
//       })
//       toast.success("Article Created Sucessfully!");
//       setRedirect(true);
//     } catch (error) {
//       console.error('Error creating article:', error);
//       toast.error("Error creating Article");
//     }
//   };

//   if (redirect) {
//     router.back();
//     return null;
//   }

//   return (
//     <div className="mt-6 flex justify-center px-4"> 
//       <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-lg">
//         <h1 className="text-2xl font-bold mb-6 text-center">Create Article</h1>
//         <div className="mb-4">
//           <label className="block text-gray-700 text-sm font-bold mb-2">Title:</label>
//           <input
//             type="text"
//             value={title}
//             onChange={e => setTitle(e.target.value)}
//             required
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block text-gray-700 text-sm font-bold mb-2">Content:</label>
//           <JoditEditor
//             ref={editor}
//             value={content}
//             onChange={newContent => setContent(newContent)}
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block text-gray-700 text-sm font-bold mb-2">Category:</label>
//           <input
//             type="text"
//             value={category}
//             onChange={e => setCategory(e.target.value)}
//             required
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block text-gray-700 text-sm font-bold mb-2">SubCategory:</label>
//           <input
//             type="text"
//             value={subCategory}
//             onChange={e => setSubCategory(e.target.value)}
//             required
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//           />
//         </div>
//         <div className="flex items-center justify-between">
//           <button
//             type="submit"
//             className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//           >
//             Submit
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default CreateArticleForm;
