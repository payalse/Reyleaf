import React, {createContext, useState, useContext} from 'react';
import AppAlert from '../components/modal/AppAlert';

export type AppAlertDataType = {
  text: string;
  isError?: boolean;
  onConfirm?: () => void;
  icon?: () => React.JSX.Element;
};

const AppAlertContext = createContext<{
  appAlertlVisible: boolean;
  showModal: (arg: AppAlertDataType) => void;
  hideModal: () => void;
} | null>(null);

export const AppAlertProvider = ({children}: {children: React.ReactNode}) => {
  const [appAlertlVisible, setAppAlertVisible] = useState(false);
  const [data, setData] = useState<AppAlertDataType>({
    text: '',
    isError: false,
  });

  const showModal = (data: AppAlertDataType) => {
    setData(data);
    setAppAlertVisible(true);
  };

  const hideModal = () => {
    setData({text: '', isError: false});
    setAppAlertVisible(false);
  };

  return (
    <AppAlertContext.Provider value={{appAlertlVisible, showModal, hideModal}}>
      {children}
      <AppAlert
        text={data.text}
        isError={data.isError}
        onConfirm={data.onConfirm}
        icon={data.icon}
      />
    </AppAlertContext.Provider>
  );
};

export const useAppAlert = () => useContext(AppAlertContext);
