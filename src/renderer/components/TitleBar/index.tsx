import MacTitleBar from './MacTitleBar';

type PropTypes = {
  showLeftDrawer: boolean;
  showRightDrawer: boolean;
  setShowLeftDrawer: (show: boolean) => void;
  setShowRightDrawer: (show: boolean) => void;
};

/**
 * The uppermost gray bar. Draggable
 */
export default function TitleBar(props: PropTypes) {
  const {
    showLeftDrawer,
    showRightDrawer,
    setShowRightDrawer,
    setShowLeftDrawer,
  } = props;

  return (
    <MacTitleBar
      showLeftDrawer={showLeftDrawer}
      showRightDrawer={showRightDrawer}
      setShowLeftDrawer={setShowLeftDrawer}
      setShowRightDrawer={setShowRightDrawer}
    />
  );
}
