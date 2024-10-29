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

interface Comment {
  id: string;
  content: string;
  parentId?: string;
  attachmentIds?: string[];
}

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
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [editCommentIndex, setEditCommentIndex] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");

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
    console.log(comments);
    setText(editor.getSelectedText() || "");
    setComment(getSelectedComment() || "");
  }, editor);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment) {
      editor.addStyles({ comment: newComment as any }); //fix later: forced to any
      editor.focus();
      editor.domElement.focus();
      setComments((prevComments: Comment[]) => [
        ...prevComments,
        {
          id: `comment-${Date.now()}`,
          content: newComment.trim(),
        },
      ]);
      setNewComment("");
    }
  };

  const handleDelete = (index: number) => {
    setComments((prevComments) => prevComments.filter((_, i) => i !== index));
    editor.removeStyles({ comment: "" as any }); //fix later: forced to any for now
  };

  const handleEditClick = (index: number) => {
    setEditCommentIndex(index);
    setEditContent(comments[index].content);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editCommentIndex !== null) {
      setComments((prevComments) =>
        prevComments.map((comment, i) =>
          i === editCommentIndex
            ? { ...comment, content: editContent }
            : comment
        )
      );
      setEditCommentIndex(null);
      setEditContent("");
    }
  };

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
                className="p-2 bg-gray-100 rounded cursor-pointer hover:bg-gray-200 transition-colors"
              >
                {comment.content}
                <div className="flex gap-2 mt-2">
                  <Button size="xs" onClick={() => handleEditClick(index)}>
                    Edit
                  </Button>
                  <Button
                    size="xs"
                    color="red"
                    onClick={() => handleDelete(index)}
                  >
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>
          {editCommentIndex !== null ? (
            <form onSubmit={handleEditSubmit} className="flex gap-2 mt-4">
              <Input
                type="text"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                placeholder="Edit comment..."
                className="flex-grow"
              />
              <Button type="submit">Update</Button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
              <Input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-grow"
              />
              <Button type="submit">Add</Button>
            </form>
          )}
        </div>
      </Popover.Dropdown>
    </Popover>
  );
};
