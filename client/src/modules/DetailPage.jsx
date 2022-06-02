import { useCallback, useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/Auth.context";
import { useParams } from 'react-router-dom';
import { useHttp } from '../hooks';
import { Loader, LinkCard } from "../components";

export const DetailPage = () => {
  const { request, loading } = useHttp();
  const { token } = useContext(AuthContext);
  const [link, setLink] = useState(null);
  const linkId = useParams().id;

  const getLink = useCallback(async () => {
    try {
      const fetched = await request(`/api/link/${linkId}`, 'GET', null, {
        Authorization: `Bearer ${token}`
      });

      setLink(fetched);

    } catch (e) {
      
    }
  }, [token, linkId, request]);

  useEffect(() => {
    getLink();
  }, [getLink]);

  if (loading) {
    return <Loader/>
  }

  return (
    <>
      { !loading && link && <LinkCard link={link} />}
    </>
  );
};
