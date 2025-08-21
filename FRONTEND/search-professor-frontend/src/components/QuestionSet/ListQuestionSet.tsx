import axios from "axios";
import React, { useEffect, useState } from "react";
import { set } from "react-hook-form";
import { useNavigate } from "react-router-dom";

export interface IListQuestionSet {
  _id: string;
  title: string;
  questionCount: number;
}

function ListQuestionSet() {
  const [questionSets, setQuestionSet] = useState<IListQuestionSet[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const Navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      setIsLoading(false);
      return;
    }

    async function fetchData() {
      axios
        .get("http://localhost:3000/api/questions/set/list", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((response) => {
          setQuestionSet(response?.data?.questionSet);
          setIsLoading(false);
        })
        .catch((error) => {
          setIsLoading(false);
        });
    }

    fetchData();
  }, []);

  if (isLoading) {
    return <p>Loading...</p>;
  }
  if (questionSets.length === 0) return <p>No question sets found.</p>;

  return (
    <div>
      <h2>My Question Sets</h2>
      <ul>
        {questionSets.map((question) => {
          const TakeQuizHandler = () => {
            Navigate(`/questionset/${question._id}/attempt`);
          };
          return (
            <li key={question._id} style={{ display: "flex", gap: "1rem" }}>
              <p>
                <strong>{question.title}</strong> — {question.questionCount}{" "}
                questions
              </p>
              <button onClick={TakeQuizHandler}>Take Quiz</button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default ListQuestionSet;
