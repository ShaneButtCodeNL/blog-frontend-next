"use client";
import { BlogPostReturn } from "@/models/blogPostReturn";
import Link from "next/link";
import markdownParserToHTMLString from "@/functions/markdownParser";

export default function BlogListDisplayItem({
  blog,
  children,
}: {
  blog: BlogPostReturn;
  children: React.ReactNode;
}) {}
