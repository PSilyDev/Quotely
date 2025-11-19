import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import './Card.css';

function Card({ quoteData, onNext, onPrev }) {
  const isLoading = !quoteData;

  // Safe fallbacks
  const authorName = !isLoading && quoteData.author ? quoteData.author : 'Unknown';
  const genre = !isLoading && quoteData.genre ? quoteData.genre : 'General';
  const text = !isLoading && quoteData.text ? quoteData.text : '';

  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    authorName
  )}&background=random&size=128&bold=true`;

  const avatarSrc = !isLoading && quoteData.image ? quoteData.image : fallbackAvatar;

  return (
    <div className="card_parent">
      <div className="left_button" onClick={onPrev} style={{ cursor: 'pointer' }}>
        <FontAwesomeIcon icon={faChevronLeft} size="3x" />
      </div>

      <div className="card_rectangle" aria-busy={isLoading}>
        <div className="card_content">
          {/* Genre pill */}
          <div className="genre_button">
            <div className="genre_frame">
              <span>{genre}</span>
            </div>
          </div>

          {/* Quote area */}
          <div className="card_frame">
            {isLoading ? (
              <div className="quote_skeleton_block">
                <div className="skeleton skeleton-line long" />
                <div className="skeleton skeleton-line" />
                <div className="skeleton skeleton-line" />
                <div className="skeleton skeleton-line short" />
              </div>
            ) : (
              <span className="quote_text">{text}</span>
            )}
          </div>

          {/* Author area */}
          <div className="author_frame">
            {isLoading ? (
              <>
                <div className="skeleton skeleton-avatar" />
                <div className="skeleton skeleton-author-text" />
              </>
            ) : (
              <>
                <img src={avatarSrc} className="author_photo" alt={authorName} />
                <span className="author_name" title={authorName}>
                  {authorName}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="right_button" onClick={onNext} style={{ cursor: 'pointer' }}>
        <FontAwesomeIcon icon={faChevronRight} size="3x" />
      </div>
    </div>
  );
}

export default Card;
