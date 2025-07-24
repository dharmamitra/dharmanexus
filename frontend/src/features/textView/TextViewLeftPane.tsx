import {
  useActiveSegmentIndexParam,
  useActiveSegmentParam,
} from "@components/hooks/params";
import { TextViewPane } from "@features/textView/TextViewPane";

export const TextViewLeftPane = () => {
  const [activeSegmentId] = useActiveSegmentParam();
  const [activeSegmentIndex] = useActiveSegmentIndexParam();

  return (
    <TextViewPane
      activeSegmentId={activeSegmentId}
      activeSegmentIndex={activeSegmentIndex}
      isRightPane={false}
    />
  );
};
