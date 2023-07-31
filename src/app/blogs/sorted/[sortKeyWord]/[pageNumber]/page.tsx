import PaginatedBlogPostList from "@/components/PaginatedBlogPostList";
import { getAllBlogPosts } from "@/functions/apiController";
import { applySorting } from "@/functions/helpers";
import { SortTypes } from "@/models/blogPostReturn";
import { store } from "@/store";
import { setCurrentPage, setList } from "@/store/blogPosts";

export default async function Page({
  params,
}: {
  params: { pageNumber: number; sortKeyWord: string };
}) {
  let sort = SortTypes.DATE_DEC;
  switch (params.sortKeyWord) {
    case "DATE_ASC": {
      sort = SortTypes.DATE_ASC;
      break;
    }
    case "DATE_DEC": {
      sort = SortTypes.DATE_DEC;
      break;
    }
    case "LIKES_ASC": {
      sort = SortTypes.LIKES_ASC;
      break;
    }
    case "LIKES_DEC": {
      sort = SortTypes.LIKES_DEC;
      break;
    }
    case "TITLE_ASC": {
      sort = SortTypes.TITLE_ASC;
      break;
    }
    case "TITLE_DEC": {
      sort = SortTypes.TITLE_DEC;
      break;
    }
    default: {
      sort = SortTypes.DATE_DEC;
    }
  }
  const data = await applySorting(await getAllBlogPosts(), sort);
  store.dispatch(setList(data));
  store.dispatch(setCurrentPage(params.pageNumber));
  return <PaginatedBlogPostList sorted={params.sortKeyWord} />;
}
