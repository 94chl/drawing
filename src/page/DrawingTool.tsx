import Canvas from "@/component/Canvas";
import Tools from "@/component/Tools";
import { styled } from "@mui/material";

const Root = styled("div")`
  display: flex;
  background-color: pink;
`;

const DrawingTool = () => {
  return (
    <Root>
      <Canvas />
      <Tools />
    </Root>
  );
};

export default DrawingTool;
