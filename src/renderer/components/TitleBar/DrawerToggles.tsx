import DrawerRightClosed from '@assets/drawer_right_closed.svg';
import DrawerRightOpen from '@assets/drawer_right_open.svg';
import DrawerLeftClosed from '@assets/drawer_left_closed.svg';
import DrawerLeftOpen from '@assets/drawer_left_open.svg';

type PropTypes = {
  showLeftDrawer: boolean;
  showRightDrawer: boolean;
  setShowLeftDrawer: (show: boolean) => void;
  setShowRightDrawer: (show: boolean) => void;
};

export default function DrawerToggles(props: PropTypes) {
  const {
    showLeftDrawer,
    showRightDrawer,
    setShowRightDrawer,
    setShowLeftDrawer,
  } = props;

  return (
    <div className="drawer-toggles">
      <img
        src={showLeftDrawer ? DrawerLeftClosed : DrawerLeftOpen}
        alt={showLeftDrawer ? 'show left drawer' : 'close left drawer'}
        height="18"
      />
      <img
        src={showRightDrawer ? DrawerRightClosed : DrawerRightOpen}
        alt={showRightDrawer ? 'show right drawer' : 'close right drawer'}
        height={18}
      />
    </div>
  );
}
