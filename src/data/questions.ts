import { Question } from '@/types';

export const questions: Question[] = [
  {
    id: 1,
    text: "Selam Tanışabilirmiyiz?",
    type: "button",
    options: {
      yes: "Evet",
      no: "Hayır"
    }
  },
  {
    id: 2,
    text: "İsmin ne güzellik?",
    type: "input",
    placeholder: "İsmini yazabilir misin?"
  },
  {
    id: 3,
    text: "Hangi şehirde yaşıyorsun?",
    type: "input",
    placeholder: "Şehir"
  },
  {
    id: 4,
    text: "Instagram kullanıyor musun?",
    type: "input",
    placeholder: "Instagram kullanıcı adını yazabilir misin?"
  },
  {
    id: 5,
    text: "En sevdiğin yemek ne?",
    type: "input",
    placeholder: "Yemek tercihin?"
  },
  {
    id: 6,
    text: "Kahve sever misin? Favori kahven nedir?",
    type: "input",
    placeholder: "Kahve tercihin?"
  }
]; 