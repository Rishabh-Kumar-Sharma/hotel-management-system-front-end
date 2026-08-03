export interface FilterProps {
  text: string;
}

export const Filter = ({ props }: { props: FilterProps }) => {
  const { text } = props || {};
  return <div>{text}</div>;
};
