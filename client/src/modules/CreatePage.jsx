import { useCallback, useState, useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../context/Auth.context";
import { useHttp } from "../hooks";

export const CreatePage = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const {request} = useHttp();
  const [link, setLink] = useState('');

  useEffect(() => {
    window.M.updateTextFields();
  }, []);

  const pressHandler = useCallback(async event => {
    if (event.key === 'Enter') {
      try {
        const data = await request('/api/link/generate', 'POST', { from: link }, {
          Authorization: `Bearer ${auth.token}`
        });
        navigate(`/detail/${data.link._id}`);
      } catch (e) {
        
      }
    }

  }, [request, link, auth.token, navigate]);

  return (
    <div className='row'>
      <div className="col s8 offset-s2" style={{paddingTop: '2rem'}}>
        <div className="input-field">
          <input
            id="link"
            type="text"
            value={link}
            onChange={e => setLink(e.target.value)}
            onKeyPress={pressHandler}
            placeholder='Введите линку'
          />
          <label htmlFor="link">Введите ссылку</label>
        </div>
      </div>
    </div>
  );
};
