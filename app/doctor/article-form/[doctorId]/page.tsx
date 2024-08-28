"use client";
import React, { useState, useRef } from "react";
import dynamic from "next/dynamic";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-toastify";
import { useArticleStore } from "@/store/useArticleStore";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";

const CreateArticleForm: React.FC = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | ArrayBuffer | null>(
    null
  );
  const [redirect, setRedirect] = useState(false);
  const editor = useRef(null);
  const router = useRouter();
  const params = useParams();
  const createArticle = useArticleStore((state) => state.createArticle);

  const doctorId = Array.isArray(params?.doctorId)
    ? params.doctorId[0]
    : params?.doctorId;

  const categories = [
    {
      name: "Healthy Hair",
      subCategories: [
        "Hair Growth",
        "Hair Loss Prevention",
        "Hair Care Tips",
        "Scalp Treatments",
        "Hair Coloring",
      ],
    },
    {
      name: "Healthy Skin",
      subCategories: [
        "Acne Treatment",
        "Anti-Aging",
        "Skin Hydration",
        "Sun Protection",
        "Skin Brightening",
      ],
    },
    {
      name: "Healthy Diet",
      subCategories: [
        "Balanced Nutrition",
        "Weight Management",
        "Detox Diet",
        "Meal Planning",
        "Nutritional Supplements",
      ],
    },
    {
      name: "Healthy Teeth",
      subCategories: [
        "Brushing Techniques",
        "Flossing Tips",
        "Oral Hygiene",
        "Teeth Whitening",
        "Dentist Visits",
      ],
    },
    {
      name: "General Health",
      subCategories: [
        "Immunity Boost",
        "Disease Prevention",
        "Detox",
        "Healthy Aging",
        "Stress Management",
      ],
    },
    {
      name: "Fitness & Exercise",
      subCategories: [
        "Cardio Workouts",
        "Strength Training",
        "Flexibility Exercises",
        "Workout Routines",
        "Recovery Techniques",
      ],
    },
    {
      name: "Pain Management",
      subCategories: [
        "Chronic Pain Relief",
        "Acute Pain Management",
        "Alternative Therapies",
        "Pain Medication",
        "Physical Therapy",
      ],
    },
    {
      name: "Mental Well-being",
      subCategories: [
        "Stress Reduction",
        "Depression Management",
        "Mindfulness Practices",
        "Counseling",
        "Emotional Support",
      ],
    },
    {
      name: "Kids & Parenting",
      subCategories: [
        "Child Development",
        "Parenting Tips",
        "Family Health",
        "Early Education",
        "Positive Discipline",
      ],
    },
  ];

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategory = e.target.value;
    setCategory(selectedCategory);
    setSubCategory(""); // Reset subcategory when category changes
  };

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("upload_preset", "doctors-app");
      uploadData.append("cloud_name", "dicldxhya");
      await fetch(`https://api.cloudinary.com/v1_1/dicldxhya/image/upload`, {
        method: "post",
        body: uploadData,
      })
        .then((res) => res.json())
        .then((data) => {
          setImage(data.url);
          console.log(data);
        })
        .catch((err) => {
          console.log(err);
        });

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!image) {
      throw new Error("Please select an image");
    }
    try {
      await createArticle({
        title,
        content,
        category,
        image,
        subCategory,
        doctorId,
      });
      toast.success("Article Created Successfully!");
      setRedirect(true);
    } catch (error) {
      console.error("Error creating article:", error);
      toast.error("Error creating Article");
    }
  };

  if (redirect) {
    router.back();
    return null;
  }

  const selectedCategory = categories.find((cat) => cat.name === category);
  const subCategories = selectedCategory ? selectedCategory.subCategories : [];

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10 px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-4xl w-full">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Create Article
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Title:
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="shadow-sm border rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Content:
            </label>
            <ReactQuill
              ref={editor}
              value={content}
              onChange={(newContent: any) => setContent(newContent)}
              className="border rounded-lg"
              modules={{
                toolbar: [
                  ["bold", "italic", "underline", "strike"], // toggled buttons
                  ["blockquote", "code-block"],

                  [{ header: 1 }, { header: 2 }], // custom button values
                  [{ list: "ordered" }, { list: "bullet" }],
                  [{ script: "sub" }, { script: "super" }], // superscript/subscript
                  [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
                  [{ direction: "rtl" }], // text direction

                  [{ size: ["small", false, "large", "huge"] }], // custom dropdown
                  [{ header: [1, 2, 3, 4, 5, 6, false] }],

                  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
                  [{ font: [] }],
                  [{ align: [] }],

                  ["link", "image", "video"],

                  ["clean"], // remove formatting button
                ],
              }}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Category:
            </label>
            <select
              value={category}
              onChange={handleCategoryChange}
              required
              className="shadow-sm border rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a Category</option>
              {categories.map((cat) => (
                <option key={cat.name} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              SubCategory:
            </label>
            <select
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              required
              className="shadow-sm border rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a SubCategory</option>
              {subCategories.map((subCat) => (
                <option key={subCat} value={subCat}>
                  {subCat}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Image:
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required
              className="shadow-sm border rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {imagePreview && (
              <img
                src={imagePreview as string}
                alt="Preview"
                className="mt-4 rounded-lg"
                style={{ maxWidth: "100%", height: "auto" }}
              />
            )}
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Create Article
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateArticleForm;
