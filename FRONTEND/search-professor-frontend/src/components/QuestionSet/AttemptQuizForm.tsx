import React from "react";
import type { IAttempQuestionForm } from "../../pages/QuestionSet/AttemptQuizPage";
import {
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
} from "react-hook-form";
import axios from "axios";

export interface IAttemptQuizFinalData {
  questionSet: string;
  responses: {
    questionId: string;
    selectedChoicesIds: string[];
  }[];
}

function AttemptQuizForm({
  questionSet,
}: {
  questionSet: IAttempQuestionForm;
}) {
  const defaultValues: IAttempQuestionForm = {
    ...questionSet,
  };
  const methods = useForm({ defaultValues });

  const { watch, register, handleSubmit } = methods;
  console.log("form values => ", watch());

  const onSubmitHandler = (data: IAttempQuestionForm) => {
    const accessToken = localStorage.getItem("accessToken");

    const finalData: IAttemptQuizFinalData = {
      questionSet: data?._id,
      responses: data?.questions?.map((question) => {
        return {
          questionId: question?._id,
          selectedChoicesIds: question?.choices
            ?.filter((choice) => choice?.selected)
            ?.map((ch) => ch?._id),
        };
      }),
    };

    axios
      .post("http://localhost:3000/api/questions/answer/attempt", finalData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        alert("Answer Set Updated Successfully");
      })
      .catch((err) => {});
  };

  return (
    <div>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmitHandler)}>
          <div>
            <label>Enter Title</label>
            <input {...register("title")} placeholder="Enter Title" />
          </div>
          <CreateQuestions />
          <button type="submit">Submit Answer</button>
        </form>
      </FormProvider>
    </div>
  );
}

function CreateQuestions() {
  const { control } = useFormContext<IAttempQuestionForm>();

  const { fields } = useFieldArray({
    control,
    name: "questions",
  });

  return (
    <div>
      <h1>Create Questions</h1>
      {fields?.map((field, index) => {
        return (
          <div key={index}>
            <p>{field?.questionText}</p>
            <CreateChoices questionIndex={index} />
          </div>
        );
      })}
    </div>
  );
}

function CreateChoices({ questionIndex }: { questionIndex: number }) {
  const { register, control } = useFormContext<IAttempQuestionForm>();

  const { fields } = useFieldArray({
    control,
    name: `questions.${questionIndex}.choices`,
  });

  return (
    <div>
      {fields?.map((field, index) => {
        return (
          <div
            key={index}
            style={{ display: "flex", gap: "1rem", paddingLeft: "1rem" }}
          >
            <input
              type="checkbox"
              {...register(
                `questions.${questionIndex}.choices.${index}.selected`
              )}
            />
            <p>{field?.text}</p>
          </div>
        );
      })}
    </div>
  );
}

export default AttemptQuizForm;
