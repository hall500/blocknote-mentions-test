import { useCallback, useMemo, useState } from "react";
import { MdComment } from "react-icons/md";

import {
  BlockNoteEditor,
  BlockSchema,
  formatKeyboardShortcut,
  InlineContentSchema,
  StyleImplementation,
  StyleSchema,
} from "@blocknote/core";

import {
  ToolbarButton,
  useBlockNoteEditor,
  useEditorContentOrSelectionChange,
  useSelectedBlocks,
} from "@blocknote/react";
import { Button, Input, Popover } from "@mantine/core";

function checkCommentInSchema(
  editor: BlockNoteEditor<BlockSchema, any, StyleSchema>
): editor is BlockNoteEditor<
  BlockSchema,
  InlineContentSchema,
  StyleSchema & {
    comment: {
      config: {
        type: string;
        propSchema: "string";
      };
      implementation: StyleImplementation;
    };
  }
> {
  return (
    "comment" in editor.schema.styleSpecs &&
    editor.schema.styleSpecs["comment"].config.type === "comment"
  );
}

export const CreateCommentButton = () => {
  const editor = useBlockNoteEditor<
    BlockSchema,
    InlineContentSchema,
    StyleSchema
  >();

  const commentInSchema = checkCommentInSchema(editor);
  const [active, setActive] = useState<boolean>(
    "comment" in editor.getActiveStyles()
  );
  const [comments, setComments] = useState([
    { id: "commentId1", content: "Here's a first comment" },
    { id: "commentId1", content: "Here's another comment" },
    { id: "commentId1", content: "And one more for good measure" },
  ]);
  const [newComment, setNewComment] = useState("");

  useEditorContentOrSelectionChange(() => {
    if (commentInSchema) {
      setActive("comment" in editor.getActiveStyles());
    }
  }, editor);

  const selectedBlocks = useSelectedBlocks(editor);

  const getSelectedComment = () => {
    return editor._tiptapEditor.getAttributes("comment").stringValue as
      | string
      | undefined;
  };

  const [comment, setComment] = useState<string>(getSelectedComment() || "");
  const [text, setText] = useState<string>(editor.getSelectedText());

  useEditorContentOrSelectionChange(() => {
    setText(editor.getSelectedText() || "");
    setComment(getSelectedComment() || "");
  }, editor);

  const handleCommentClick = (index: number) => {
    setComments((prevComments) => {
      const updatedComments = [...prevComments];
      const [clickedComment] = updatedComments.splice(index, 1);
      return [...updatedComments, clickedComment];
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment) {
      setComments((prevComments) => [
        ...prevComments,
        {
          id: "newcomment",
          resourceType: "page",
          resourceId: "pass-in-resourceid",
          content: newComment.trim(),
          createdById: "createdByJohn",
        },
      ]);
      setNewComment("");
    }
  };

  const update = useCallback(
    (comment: string) => {
      // @ts-ignore
      editor.addStyles({ comment: comment });
      editor.focus();
      editor.domElement.focus();
    },
    [editor]
  );

  const onDelete = useCallback(() => {
    // @ts-ignore
    editor.removeStyles({ comment: "" });
  }, [editor]);

  const show = useMemo(() => {
    if (!commentInSchema) {
      return false;
    }

    for (const block of selectedBlocks) {
      if (block.content === undefined) {
        return false;
      }
    }

    return true;
  }, [commentInSchema, selectedBlocks]);

  if (!show) {
    return null;
  }

  return (
    <Popover withinPortal={false} zIndex={10000}>
      <Popover.Target>
        <ToolbarButton
          isSelected={active}
          mainTooltip={"Create Comment"}
          secondaryTooltip={formatKeyboardShortcut("Mod+K")}
          icon={MdComment}
        />
      </Popover.Target>
      <Popover.Dropdown>
        <div className="max-w-md mx-auto p-4 space-y-4">
          <h1 className="text-2xl font-bold mb-4">Comments</h1>
          <ul className="space-y-2">
            {comments.map((comment, index) => (
              <li
                key={index}
                onClick={() => handleCommentClick(index)}
                className="p-2 bg-gray-100 rounded cursor-pointer hover:bg-gray-200 transition-colors"
              >
                {comment.content}
              </li>
            ))}
          </ul>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-grow"
            />
            <Button type="submit">Add</Button>
          </form>
        </div>
      </Popover.Dropdown>
    </Popover>
  );
};
