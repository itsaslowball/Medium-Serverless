import { Navbar } from './Navbar'

type ParentProps = {
        children: React.ReactNode;
};

export const Element: React.FC<ParentProps> = ({children}) => {
  return (
          <div className='md:px-72'>
                  <Navbar />
                  {children}
          </div>
  )
}
