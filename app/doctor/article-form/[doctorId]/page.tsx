"use client";
import React, { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-toastify";
import { useArticleStore } from "@/store/useArticleStore";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import styles from "./CreateArticleForm.module.css";

const CreateArticleForm: React.FC = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | ArrayBuffer | null>(
    null
  );
  const [titleError, setTitleError] = useState<string>("");
  const [contentError, setContentError] = useState<string>("");
  const [categoryError, setCategoryError] = useState<string>("");
  const [subCategoryError, setSubCategoryError] = useState<string>("");
  const [imageError, setImageError] = useState<string>("");
  const [redirect, setRedirect] = useState(false);
  const editor = useRef(null);
  const router = useRouter();
  const params = useParams();
  const createArticle = useArticleStore((state) => state.createArticle);
  const editArticle = useArticleStore((state) => state.editArticle);
  const setEditArticle = useArticleStore((state) => state.setEditArticle);
  const updateArticle = useArticleStore((state) => state.updateArticle);

  const doctorId = Array.isArray(params?.doctorId)
    ? params.doctorId[0]
    : params?.doctorId;

  useEffect(() => {
    if (editArticle) {
      setTitle(editArticle.title);
      setContent(editArticle.content);
      setCategory(editArticle.category);
      setSubCategory(editArticle.subCategory);
      setImagePreview(editArticle.image);
      setImage(editArticle.image);
    } else {
      setTitle("");
      setContent("");
      setCategory("");
      setSubCategory("");
      setImagePreview(null);
    }
  }, [editArticle]);

  const categories = [
    {
      name: "Healthy Hair",
      subCategories: [
        "Hair Growth",
        "Hair Loss Prevention",
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
      ],
    },
    {
      name: "General Health",
      subCategories: [
        "Immunity Boost",
        "Injury care",
        "Healthy Digestion",
        "Periods Care",
        "Sleep Better",
      ],
    },
    {
      name: "Fitness & Exercise",
      subCategories: [
        "Cardio Workouts",
        "Strength Training",
        "Medication",
        "Everyday Fitness",
        "Yoga",
      ],
    },
    {
      name: "Pain Management",
      subCategories: ["Back Pain", "Neck Pain", "Headache", "Physical Therapy"],
    },
    {
      name: "Mental Well-being",
      subCategories: [
        "Stress Reduction",
        "Depression Management",
        "Addiction",
        "Counseling",
        "Emotional Support",
        "Anger Management",
      ],
    },
    {
      name: "Kids & Parenting",
      subCategories: [
        "Child Development",
        "Parenting Tips",
        "During/After Pregnancy",
        "Positive Discipline",
        "Childhood Nutrition",
      ],
    },
  ];

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategory = e.target.value;
    setCategory(selectedCategory);
    if (e.target.value.trim().length > 0) {
      setCategoryError("");
    } else {
      setCategoryError("Category is required.");
    }
    setSubCategory(""); // Reset subcategory when category changes
  };
  const handleSubCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSubCategory = e.target.value;
    setSubCategory(selectedSubCategory);
    if (e.target.value.trim().length > 0) {
      setSubCategoryError("");
    } else {
      setSubCategoryError("Sub-Category is required.");
    }
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

      try {
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/dicldxhya/image/upload`,
          {
            method: "post",
            body: uploadData,
          }
        );
        const data = await res.json();
        setImage(data.url);
        setImageError("");
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      } catch (err) {
        console.error(err);
        setImageError("Failed to upload image.");
      }
    }
  };

  const validateForm = () => {
    let valid = true;
    if (!title) {
      setTitleError("Title is required.");
      valid = false;
    } else {
      setTitleError("");
    }

    if (!content) {
      setContentError("Content is required.");
      valid = false;
    } else {
      setContentError("");
    }

    if (!category) {
      setCategoryError("Category is required.");
      valid = false;
    } else {
      setCategoryError("");
    }

    if (!subCategory) {
      setSubCategoryError("Subcategory is required.");
      valid = false;
    } else {
      setSubCategoryError("");
    }

    if (!image) {
      setImageError("Image is required.");
      valid = false;
    } else {
      setImageError("");
    }

    return valid;
  };
  const handleTitleChange = (e: any) => {
    setTitle(e.target.value);
    if (e.target.value.trim().length > 0) {
      setTitleError("");
    } else {
      setTitleError("Title is required.");
    }
  };
  const handleContentChange = (content: any) => {
    setContent(content);
    if (content.trim().length > 0) {
      setContentError("");
    } else {
      setContentError("Content is required.");
    }
  };
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }

    try {
      if (image) {
        if (!editArticle) {
          await createArticle({
            title,
            content,
            category,
            image,
            subCategory,
            doctorId,
          });
          setRedirect(true);
          toast.success("Article Created Successfully!");
        } else {
          await updateArticle({
            _id: editArticle._id,
            title,
            content,
            category,
            image,
            subCategory,
            doctorId,
          });
          setEditArticle(null);
          toast.success("Article Updated Successfully!");
          router.push("/doctor/myArticles");
        }
      }
    } catch (error) {
      console.error("Error creating or updating article:", error);
      toast.error("Error creating or updating article.");
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
          {editArticle ? "Update" : "Create"} Article
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Title:
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e)}
              className={`shadow-sm border rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 ${
                titleError
                  ? "border-red-500 focus:ring-red-500"
                  : "focus:ring-blue-500"
              }`}
            />
            {titleError && (
              <div className="text-red-600 text-sm mt-2">{titleError}</div>
            )}
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Content:
            </label>
            <ReactQuill
              ref={editor}
              value={content}
              onChange={(newContent: any) => handleContentChange(newContent)}
              className={`border rounded-lg ${
                contentError ? "border-red-500" : ""
              }`}
              modules={{
                toolbar: [
                  ["bold", "italic", "underline", "strike"], // toggled buttons

                  [{ list: "ordered" }, { list: "bullet" }],
                  [{ script: "sub" }, { script: "super" }], // superscript/subscript
                  [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
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
            {contentError && (
              <div className="text-red-600 text-sm mt-2">{contentError}</div>
            )}
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Category:
            </label>
            <select
              value={category}
              onChange={handleCategoryChange}
              className={`shadow-sm border rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 ${
                categoryError
                  ? "border-red-500 focus:ring-red-500"
                  : "focus:ring-blue-500"
              }`}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.name} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
            {categoryError && (
              <div className="text-red-600 text-sm mt-2">{categoryError}</div>
            )}
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Subcategory:
            </label>
            <select
              value={subCategory}
              onChange={(e) => handleSubCategoryChange(e)}
              className={`shadow-sm border rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 ${
                subCategoryError
                  ? "border-red-500 focus:ring-red-500"
                  : "focus:ring-blue-500"
              }`}
              disabled={!category}
            >
              <option value="">Select Subcategory</option>
              {subCategories.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
            {subCategoryError && (
              <div className="text-red-600 text-sm mt-2">
                {subCategoryError}
              </div>
            )}
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Image:
            </label>
            <input
              type="file"
              onChange={handleImageChange}
              className={`shadow-sm border rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 ${
                imageError
                  ? "border-red-500 focus:ring-red-500"
                  : "focus:ring-blue-500"
              }`}
            />
            {imagePreview && (
              <img
                src={imagePreview as string}
                alt="Image preview"
                className="mt-4 max-w-xs mx-auto"
              />
            )}
            {imageError && (
              <div className="text-red-600 text-sm mt-2">{imageError}</div>
            )}
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white py-3 px-6 rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {editArticle ? "Update" : "Create"} Article
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateArticleForm;
