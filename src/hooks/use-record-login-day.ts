import { useMutation } from "@tanstack/react-query";
import { recordLoginDay } from "@/api/user-login-days";

export const useRecordLoginDay = () =>
  useMutation({ mutationFn: recordLoginDay });
