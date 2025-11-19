import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import './Card.css';

function Card({ quoteData, onNext, onPrev }) {
  if (!quoteData) {
    return <div>Loading...</div>;
  }

  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    quoteData.author || "Unknown"
  )}&background=random&size=128&bold=true`;

  const avatarSrc = quoteData.image ? quoteData.image : fallbackAvatar;

  const authorName = quoteData.author || "Unknown";

  return (
    <div className="card_parent">
      <div className="left_button" onClick={onPrev} style={{ cursor: "pointer" }}>
        <FontAwesomeIcon icon={faChevronLeft} size="3x" />
      </div>

      <div className="card_rectangle">
        <div className="card_content">
          <div className="genre_button">
            <div className="genre_frame">
              {/* <text> is not valid HTML, use span */}
              <span>{quoteData.genre || "General"}</span>
            </div>
          </div>

          <div className="card_frame">
            {/* long quotes stay inside via CSS */}
            <span className="quote_text">{quoteData.text}</span>
          </div>

          <div className="author_frame">
            <img src={avatarSrc} className="author_photo" alt={authorName} />
            {/* ellipsis + tooltip on hover */}
            <span className="author_name" title={authorName}>
              {authorName}
            </span>
          </div>
        </div>
      </div>

      <div className="right_button" onClick={onNext} style={{ cursor: "pointer" }}>
        <FontAwesomeIcon icon={faChevronRight} size="3x" />
      </div>
    </div>
  );
}

export default Card;
