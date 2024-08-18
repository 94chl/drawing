import Canvas from "@/component/Canvas";
import Tools from "@/component/Tools";
import { styled, Divider } from "@mui/material";

const Root = styled("div")`
  display: flex;
`;

const DrawingTool = () => {
  return (
    <Root>
      <Canvas />
      <Divider orientation="vertical" flexItem />
      <Tools />
    </Root>
  );
};

export default DrawingTool;
