import Image from 'next/image';
import { RegisterForm } from './form';

export default function Register() {
    return (
      <>
        <div className="flex flex-1 h-full">
          <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
            <div className="mx-auto w-full max-w-sm lg:w-96">
              <div>
                <Image
                  alt="Buttonline"
                  src="/logo.svg"
                  height={46}
                  width={400}
                  className='mx-auto'
                />
                <h2 className="mt-8 text-2xl/9 font-bold tracking-tight text-primary">Crie sua conta</h2>
                <p className="mt-2 text-sm/6 text-gray-500">
                  Já possui uma conta?{' '}
                  <a href="/login" className="font-semibold text-secondary hover:text-secondary-dark">
                    Iniciar sessão.
                  </a>
                </p>
              </div>
  
              <div className="mt-10">
                <div>
                    <RegisterForm />
                </div>
  
              </div>
            </div>
          </div>
          <div className="relative hidden w-0 flex-1 lg:block">
          <Image
            alt=""
            src="/register.jpeg"
            layout="fill"
            objectFit="cover"
            className="absolute inset-0 object-center"
            />
          </div>
        </div>
      </>
    )
  }
  