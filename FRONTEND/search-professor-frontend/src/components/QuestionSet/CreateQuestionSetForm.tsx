import axios from "axios";
import {
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
} from "react-hook-form";

export interface QuestionSetForm {
  title: string;
  questions: {
    questionText: string;
    choices: { text: string; label: string; correctAnswer: boolean }[];
  }[];
}

function CreateQuestionSetForm() {
  const defaultValues: QuestionSetForm = {
    title: "",
    questions: [
      {
        questionText: "",
        choices: [],
      },
    ],
  };

  const methods = useForm({ defaultValues });
  const { watch, register, handleSubmit } = methods;
  console.log("form values => ", watch());

  const onSubmitHandler = (data: QuestionSetForm) => {
    const accessToken = localStorage.getItem("accessToken");
    axios
      .post("http://localhost:3000/api/admin/questionset/create", data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        alert("Question Set Created Successfully");
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
          <button type="submit">Create QuestionSet</button>
        </form>
      </FormProvider>
    </div>
  );
}

function CreateQuestions() {
  const { register, control } = useFormContext<QuestionSetForm>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  const AddQuestionHandler = () => {
    append({
      choices: [],
      questionText: "",
    });
  };

  return (
    <div>
      <h1>Create Questions</h1>
      {fields?.map((field, index) => {
        const RemoveQuestionHandler = () => {
          remove(index);
        };
        return (
          <div key={index}>
            <input
              {...register(`questions.${index}.questionText`)}
              placeholder="Enter Questions"
            />
            <button type="button" onClick={RemoveQuestionHandler}>
              Remove
            </button>

            <CreateChoices questionIndex={index} />
          </div>
        );
      })}

      <button type="button" onClick={AddQuestionHandler}>
        Add Questions
      </button>
    </div>
  );
}

function CreateChoices({ questionIndex }: { questionIndex: number }) {
  const { register, control } = useFormContext<QuestionSetForm>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: `questions.${questionIndex}.choices`,
  });

  const AddChoicesHandler = () => {
    append({
      label: fields?.length.toString(),
      text: "",
      correctAnswer: false,
    });
  };
  return (
    <div>
      {fields?.map((field, index) => {
        const RemoveChoiceHandler = () => {
          remove(index);
        };
        return (
          <div key={index}>
            <input
              type="checkbox"
              {...register(
                `questions.${questionIndex}.choices.${index}.correctAnswer`
              )}
            />
            <input
              {...register(`questions.${questionIndex}.choices.${index}.text`)}
              placeholder="Enter Choice"
            />
            <button type="button" onClick={RemoveChoiceHandler}>
              Remove Choice
            </button>
          </div>
        );
      })}
      <button type="button" onClick={AddChoicesHandler}>
        Add Choices
      </button>
    </div>
  );
}

export default CreateQuestionSetForm;
