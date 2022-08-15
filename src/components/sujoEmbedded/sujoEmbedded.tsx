import React from "react";

function SujoEmbedded(props: {field_training: boolean }): JSX.Element {
  const { field_training } = props;

  return (
    <div>
      <iframe
        title="Sujo"
        src={
          field_training
            ? "https://tyopa.sujo.fi/pls/sujo/tyoko.training"
            : "https://tyopa.sujo.fi/pls/sujo/tyoko.salary"
        }
        height="800px"
        width="100%"
        frameBorder="0"
      />
    </div>
  );
}

export default SujoEmbedded;