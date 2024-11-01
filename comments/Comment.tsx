import { createReactStyleSpec } from "@blocknote/react";
import { useMemo } from "react";

export const comment = createReactStyleSpec(
  {
    type: "comment",
    propSchema: "string",
  },
  {
    render: (props) => {
      const id = useMemo(() => {
        const timestamp = new Date().valueOf();
        const commentValue = props.value ? props.value.toString() : "";
        return `comment-${timestamp}-${commentValue}`;
      }, [props.value]);

      return (
        <span
          id={id}
          className="testing"
          ref={props.contentRef}
          style={
            props.value
              ? { borderBottom: "2px solid #000", backgroundColor: "#f0f0f0" }
              : {}
          }
        ></span>
      );
    },
  }
);
