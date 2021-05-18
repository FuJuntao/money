import {useBoolean} from "../../snowpack/pkg/@chakra-ui/react.js";
import {useCallback, useState} from "../../snowpack/pkg/react.js";
export const useMutation = (fn) => {
  const [isLoading, {on: setIsLoading, off: setIsNotLoading}] = useBoolean();
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const mutate = useCallback(async (...args) => {
    try {
      setIsLoading();
      const result2 = await fn(...args);
      setResult(result2);
      return result2;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsNotLoading();
    }
  }, [fn, setIsLoading, setIsNotLoading]);
  return {
    mutate,
    data: result,
    errors: error,
    isLoading
  };
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiQzpcXHdvcmtzcGFjZVxcbW9uZXlcXHNyY1xcaG9va3NcXHVzZU11dGF0aW9uLnRzIl0sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFDQTtBQUVPLGFBQU0sY0FBYyxDQUN6QixPQUNHO0FBQ0gsUUFBTSxDQUFDLFdBQVcsQ0FBRSxJQUFJLGNBQWMsS0FBSyxvQkFBcUI7QUFDaEUsUUFBTSxDQUFDLE9BQU8sWUFBWSxTQUF1QjtBQUNqRCxRQUFNLENBQUMsUUFBUSxhQUFhLFNBQTBCO0FBRXRELFFBQU0sU0FBUyxZQUNiLFVBQVUsU0FBZTtBQUN2QixRQUFJO0FBQ0Y7QUFDQSxZQUFNLFVBQVMsTUFBTSxHQUFHLEdBQUc7QUFDM0IsZ0JBQVU7QUFDVixhQUFPO0FBQUEsYUFDQSxLQUFQO0FBQ0EsZUFBUztBQUNULFlBQU07QUFBQSxjQUNOO0FBQ0E7QUFBQTtBQUFBLEtBR0osQ0FBQyxJQUFJLGNBQWM7QUFHckIsU0FBTztBQUFBLElBQ0w7QUFBQSxJQUNBLE1BQU07QUFBQSxJQUNOLFFBQVE7QUFBQSxJQUNSO0FBQUE7QUFBQTsiLAogICJuYW1lcyI6IFtdCn0K
