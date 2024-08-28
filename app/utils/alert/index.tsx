import {ALERT_TYPE, Dialog} from 'react-native-alert-notification';

type Props = {
  title?: string;
  textBody?: string;
  button?: string;
  type?: ALERT_TYPE;
};

const ShowAlert = ({
  textBody,
  title,
  button,
  type = ALERT_TYPE.SUCCESS,
}: Props) => {
  Dialog.show({
    type: type,
    title: title,
    textBody: textBody,
    button: button || 'close',
  });
};

export {ShowAlert};
