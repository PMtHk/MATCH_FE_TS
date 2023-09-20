import React from 'react';
import { useNavigate } from 'react-router-dom';
import { defaultAxios } from 'apis/utils';
import { connectRSOMypage } from 'apis/api/valorant';
import { changeNickname } from 'apis/api/user';
import { snackbarActions } from 'store/snackbar-slice';
import Linear from 'components/loading/Linear';

const RsoCallback = () => {
  const navigate = useNavigate();
  const params = new URL(document.URL).searchParams;
  const rsoAccessCode = params.get('code');

  if (!rsoAccessCode) {
    navigate('/mypage');
  }

  React.useEffect(() => {
    const doConnectRSO = async () => {
      try {
        const { gameName, tagLine } = await connectRSOMypage(
          rsoAccessCode as string,
        );

        // TODO: load history 로 수정하기
        await defaultAxios.get(`/api/valorant/user/${gameName}%23${tagLine}`);

        await changeNickname('valorant', `${gameName}#${tagLine}`);
      } catch (error: any) {
        snackbarActions.OPEN_SNACKBAR({
          message:
            '발로란트 연동에 실패하였습니다. 라이엇 홈페이지에서 로그아웃 후 다시 시도해주세요.',
          severity: 'error',
        });
      } finally {
        navigate('/mypage');
      }
    };
    if (rsoAccessCode) {
      doConnectRSO();
    }
  }, []);

  return (
    <Linear height="100vh" text="라이엇 계정을 MatchGG와 연결하고 있습니다." />
  );
};

export default RsoCallback;
