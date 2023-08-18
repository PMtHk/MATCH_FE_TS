import { defaultAxios } from 'apis/utils';
import { useEffect, useState } from 'react';

type LolInfoProps = {
  summonerName: string;
};
type PubgInfoProps = {
  name: string;
};
type OverwarchInfoProps = {
  name: string;
};

export const LolInfo = ({ summonerName }: LolInfoProps) => {
  const [info, setInfo] = useState<any>(null);

  useEffect(() => {
    const fetchLolInfo = async () => {
      await defaultAxios
        .get(`/api/lol/summoner/${summonerName}/duo_rank`)
        .then((response) => setInfo(response.data))
        .catch((error) => console.log(error));
    };
    fetchLolInfo();
  }, []);

  return <div />;
};

export const PubgInfo = ({ name }: PubgInfoProps) => {
  const [info, setInfo] = useState<any>(null);

  return <div />;
};

export const OverwatchInfo = ({ name }: OverwarchInfoProps) => {
  const [info, setInfo] = useState<any>(null);

  return <div />;
};
