import { createReactStyleSpec } from "@blocknote/react";
import { useMemo } from "react";

export const comment = createReactStyleSpec(
  {
    type: "comment",
    propSchema: "string",
  },
  {
    render: (props) => {
      console.log(props.value);
      const id = useMemo(() => new Date().valueOf().toString(), [props]);
      return (
        <span
          id={id}
          className="testing"
          ref={props.contentRef}
          style={props.value ? { background: "#000", color: "#fff" } : {}}
        ></span>
      );
    },
  }
);
