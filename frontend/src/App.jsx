import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import "./App.css";
import SearchBox from "./components/SearchBox";
import Card from "./components/Card";
import Search from "./Search";

function App() {
  const [quoteData, setQuoteData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/quotes/", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        console.log("data received, App.jsx - ", data);
        setQuoteData(data);
        setCurrentIndex(0);
      } catch (error) {
        console.error("Error fetching quotes:", error);
      }
    };

    if (quoteData.length === 0) {
      fetchQuotes();
    }
  }, []); // we only need to run this once on mount

  const handleNextQuote = () => {
    if (quoteData.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % quoteData.length);
  };

  const handlePrevQuote = () => {
    if (quoteData.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex - 1 + quoteData.length) % quoteData.length);
  };

  const currentQuote = quoteData.length > 0 ? quoteData[currentIndex] : null;

  return (
    <>
      {showSearch ? (
        <Search quoteData={quoteData} setQuoteData={setQuoteData} />
      ) : (
        <div className="base">
          <div className="content">
            <div className="master">
              <div className="search_parent">
                <div className="search_heading">
                  <h1>
                    Discover the quotes written for <em>you</em>.
                  </h1>
                </div>
                <div className="search_subheading">
                  <h4>Immerse yourself in the words of the masters.</h4>
                </div>
                <div className="search_left">
                  <SearchBox setQuoteData={setQuoteData} setShowSearch={setShowSearch} />
                </div>
              </div>

              {/* ✅ Render Card only when we actually have a quote */}
              <Card
                quoteData={currentQuote}
                onNext={handleNextQuote}
                onPrev={handlePrevQuote}
              />
            </div>
          </div>

          <div className="made_with_love">
            Made with love{" "}
            <FontAwesomeIcon
              icon={faHeart}
              size="sm"
              style={{ color: "#ff0000", marginLeft: "5px", marginRight: "5px" }}
            />{" "}
            by <em>Prakhar</em> and <em>Neelabh.</em>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
