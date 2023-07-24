"use client";
import { closeMakeCommentReplyModal } from "@/functions/helpers";
import type { RootState, AppDispatch } from "@/store";
import { setBody, setTitle } from "@/store/commentReply";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export default function MakeCommentReplyModal() {
  const dispatch = useAppDispatch();
  const blogId = useAppSelector((state) => state.commentReply.blogId);
  const body = useAppSelector((state) => state.commentReply.body);
  const parentCommentId = useAppSelector(
    (state) => state.commentReply.parentCommentId
  );
  const title = useAppSelector((state) => state.commentReply.title);

  return (
    <dialog className="modal" id="make-comment-reply-modal">
      <form className="modal-form">
        <label>Title</label>
        <input
          type="text"
          className="form-input"
          value={title}
          onChange={(e) => dispatch(setTitle(e.target.value))}
        />
        <label>Body</label>
        <textarea
          className="form-input"
          value={body}
          onChange={(e) => dispatch(setBody(e.target.value))}
        ></textarea>
        <button type="submit" className="form-button">
          Confirm
        </button>
        <button
          type="button"
          className="form-button"
          onClick={closeMakeCommentReplyModal}
        >
          Cancel
        </button>
      </form>
    </dialog>
  );
}
