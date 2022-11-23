import lodash from "lodash";
import { FormState } from "types/form.type";
import FormAction from "./writeReducer.type";

function writeReducer(state: FormState, action: FormAction) {
  const { type } = action;

  if (type === "CHANGE_TITLE") {
    const { value } = action;

    return {
      ...state,
      form: {
        ...state.form,
        title: value,
      },
    };
  }
  if (type === "CHANGE_DESCRIPTION") {
    const { value } = action;

    return {
      ...state,
      form: {
        ...state.form,
        description: value,
      },
    };
  }
  if (type === "CHANGE_QUESTION_TITLE") {
    const { questionIndex, value } = action;

    const left = state.question.slice(0, questionIndex);
    const curr = { ...state.question[questionIndex], title: value };
    const right = state.question.slice(questionIndex + 1);

    return {
      ...state,
      question: [...left, curr, ...right],
    };
  }
  if (type === "CHANGE_QUESTION_TYPE") {
    const { questionIndex, value } = action;
    const prevType = state.question[questionIndex].type;
    if (prevType === value) return state;

    const left = state.question.slice(0, questionIndex);
    const right = state.question.slice(questionIndex + 1);
    let curr;

    if ((prevType === "checkbox" || prevType === "multiple") && value === "paragraph")
      curr = {
        ...state.question[questionIndex],
        type: value,
        option: [],
      };
    else if (prevType === "paragraph" && (value === "checkbox" || value === "multiple"))
      curr = {
        ...state.question[questionIndex],
        type: value,
        option: [{ choiceId: 1, value: "옵션1" }],
        currentChoiceId: 1,
      };
    else curr = { ...state.question[questionIndex], type: value };

    return {
      ...state,
      question: [...left, curr, ...right],
    };
  }
  if (type === "ADD_QUESTION_CHOICE") {
    const { questionIndex } = action;

    const optionLength = state.question[questionIndex].option.length;
    const { currentChoiceId } = state.question[questionIndex];

    const left = state.question.slice(0, questionIndex);
    const curr = {
      ...state.question[questionIndex],
      currentChoiceId: currentChoiceId + 1,
      option: [
        ...state.question[questionIndex].option,
        { choiceId: currentChoiceId + 1, value: `옵션${optionLength + 1}` },
      ],
    };
    const right = state.question.slice(questionIndex + 1);

    return {
      ...state,
      question: [...left, curr, ...right],
    };
  }
  if (type === "MODIFY_QUESTION_CHOICE") {
    const { value, questionIndex, choiceIndex } = action;

    const leftQuestion = state.question.slice(0, questionIndex);
    const rightQuestion = state.question.slice(questionIndex + 1);
    const leftChoice = state.question[questionIndex].option.slice(0, choiceIndex);
    const rightChoice = state.question[questionIndex].option.slice(choiceIndex + 1);
    const currQuestion = {
      ...state.question[questionIndex],
      option: [...leftChoice, { ...state.question[questionIndex].option[choiceIndex], value }, ...rightChoice],
    };

    return {
      ...state,
      question: [...leftQuestion, currQuestion, ...rightQuestion],
    };
  }
  if (type === "DELETE_QUESTION_CHOICE") {
    const { questionIndex, choiceIndex } = action;

    const leftQuestion = state.question.slice(0, questionIndex);
    const rightQuestion = state.question.slice(questionIndex + 1);
    const leftChoice = state.question[questionIndex].option.slice(0, choiceIndex);
    const rightChoice = state.question[questionIndex].option.slice(choiceIndex + 1);
    const currQuestion = {
      ...state.question[questionIndex],
      option: [...leftChoice, ...rightChoice],
    };

    return {
      ...state,
      question: [...leftQuestion, currQuestion, ...rightQuestion],
    };
  }
  if (type === "COPY_QUESTION") {
    const { questionIndex } = action;

    const { currentQuestionId } = state.form;
    const leftQuestion = state.question.slice(0, questionIndex);
    const rightQuestion = state.question.slice(questionIndex + 1);
    const currentQuestion = state.question[questionIndex];
    const copyQuestion = { ...lodash.cloneDeep(currentQuestion), questionId: currentQuestionId + 1 };

    return {
      form: { ...state.form, currentQuestionId: currentQuestionId + 1 },
      question: [...leftQuestion, currentQuestion, copyQuestion, ...rightQuestion],
    };
  }
  if (type === "DELETE_QUESTION") {
    const { questionIndex } = action;

    const leftQuestion = state.question.slice(0, questionIndex);
    const rightQuestion = state.question.slice(questionIndex + 1);

    return {
      ...state,
      question: [...leftQuestion, ...rightQuestion],
    };
  }
  if (type === "CHANGE_QUESTION_ESSENTIAL") {
    const { questionIndex } = action;
    const prevState = state.question[questionIndex].essential;

    const leftQuestion = state.question.slice(0, questionIndex);
    const rightQuestion = state.question.slice(questionIndex + 1);
    const currQuestion = {
      ...state.question[questionIndex],
      essential: !prevState,
    };

    return {
      ...state,
      question: [...leftQuestion, currQuestion, ...rightQuestion],
    };
  }
  if (type === "SELECT_FORM_CATEGORY") {
    const { value } = action;

    return {
      ...state,
      form: {
        ...state.form,
        category: value,
      },
    };
  }
  if (type === "FETCH_DATA") {
    const { init } = action;
    return { ...state, ...init };
  }

  return state;
}

export default writeReducer;
