import { css } from "@emotion/react";

import Canvas from "@/component/Canvas";
import Tools from "@/component/Tools";
import { Divider } from "@mui/material";

const DrawingTool = () => {
  return (
    <div
      css={css`
        display: flex;
      `}
    >
      <Canvas />
      <Divider orientation="vertical" flexItem />
      <Tools />
    </div>
  );
};

export default DrawingTool;
