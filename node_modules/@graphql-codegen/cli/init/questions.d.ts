import inquirer from 'inquirer';
import { Tags, Answers } from './types';
export declare function getQuestions(possibleTargets: Record<Tags, boolean>): inquirer.QuestionCollection;
export declare function getApplicationTypeChoices(possibleTargets: Record<Tags, boolean>): {
    name: string;
    key: string;
    value: Tags[];
    checked: boolean;
}[];
export declare function getPluginChoices(answers: Answers): inquirer.DistinctChoice<inquirer.AllChoiceMap<inquirer.Answers>, inquirer.AllChoiceMap<inquirer.AllChoiceMap<inquirer.Answers>>>[];
export declare function getOutputDefaultValue(answers: Answers): "src/generated/graphql.tsx" | "src/generated/graphql.ts" | "src/generated/graphql.js";
