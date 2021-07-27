import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const Deck = () => {
  const [deck, setDeck] = useState(null);
  const [cards, setCard] = useState([]);
  const [draw, setDraw] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    const grabDeck = async () => {
      const res = await axios.get(`http://deckofcardsapi.com/api/deck/new/`);
      setDeck(res.data);
    };
    grabDeck();
  }, [setDeck]);

  useEffect(() => {
    const handleGrabCard = async () => {
      const { deck_id } = deck;
      const res = await axios.get(
        `http://deckofcardsapi.com/api/deck/${deck_id}/draw/`
      );

      if (res.data.remaining === 0) {
        setDraw(false);
        alert('No Cards Remaining!');
      }

      setCard([...cards, res.data.cards[0]]);
    };

    if (draw && !timer.current) {
      timer.current = setInterval(async () => {
        await handleGrabCard();
      }, 1000);
    }

    return () => {
      clearInterval(timer.current);
      timer.current = null;
    };
  }, [cards, deck, draw]);

  //   const handleCardGrab = async (id) => {
  //     const res = await axios.get(`http://deckofcardsapi.com/api/deck/${id}/draw/
  //     `);
  //     setCard([...cards, res.data.cards[0]]);
  //     setDeck({ ...deck, remaining: res.data.remaining });
  //   };

  const handleDraw = () => {
    setDraw((draw) => !draw);
  };

  return (
    <>
      <div className='btn-container'>
        <button onClick={handleDraw}>{draw ? 'Stop' : 'Gimme A Card!'}</button>
      </div>
      <div className='Deck'>
        {cards.map((card) => (
          <img
            key={card.code}
            style={{ width: '100px', height: '100px' }}
            src={card.image}
            alt=''
          />
        ))}
      </div>
    </>
  );
};

export default Deck;
