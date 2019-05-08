import classNames from 'classnames'
import { withFormik } from 'formik'
import gql from 'graphql-tag'
import { FC, useContext } from 'react'

import { Button } from '~/components/Button'
import { Form } from '~/components/Form'
import { getErrorCodes, Mutation } from '~/components/GQL'
import IconSpinner from '~/components/Icon/Spinner'
import { LanguageContext, Translate } from '~/components/Language'
import { ModalSwitch } from '~/components/ModalManager'

import {
  ADD_TOAST,
  ANALYTICS_EVENTS,
  ERROR_CODES,
  PATHS,
  TEXT
} from '~/common/enums'
import {
  analytics,
  clearPersistCache,
  isValidEmail,
  redirectToTarget,
  translate
} from '~/common/utils'

import styles from './styles.css'

/**
 * This component is designed for Login form with builtin mutation.
 *
 * Usage:
 *
 * ```jsx
 *   <LoginForm
 *     extraClass={[]}
 *     purpose="modal"
 *     submitCallback={()=> {}}
 *   />
 * ```
 *
 */
interface Props {
  extraClass?: string[]
  purpose: 'modal' | 'page'
  submitCallback?: () => void
}

export const MUTATION_USER_LOGIN = gql`
  mutation UserLogin($input: UserLoginInput!) {
    userLogin(input: $input) {
      auth
    }
  }
`

const LoginForm: FC<Props> = ({ extraClass = [], purpose, submitCallback }) => {
  const { lang } = useContext(LanguageContext)

  const validateEmail = (value: string, language: string) => {
    let result: any

    if (!value) {
      result = { zh_hant: '必填欄位', zh_hans: '必填栏位' }
    } else if (!isValidEmail(value)) {
      result = { zh_hant: '電子信箱格式有誤', zh_hans: '邮箱格式有误' }
    }
    if (result) {
      return translate({ ...result, lang: language })
    }
  }

  const validatePassword = (value: string, language: string) => {
    let result: any

    if (!value) {
      result = { zh_hant: '必填欄位', zh_hans: '必填栏位' }
    }
    if (result) {
      return translate({ ...result, lang: language })
    }
  }

  const PasswordResetRedirectButton = () => (
    <>
      <Button
        is="link"
        bgColor="transparent"
        className="u-link-green"
        spacing="none"
        href={PATHS.AUTH_FORGET.href}
        as={PATHS.AUTH_FORGET.as}
      >
        {translate({ zh_hant: '忘記密碼', zh_hans: '忘记密码', lang })}？
      </Button>
      <style jsx>{styles}</style>
    </>
  )

  const PasswordResetModalSwitch = () => (
    <ModalSwitch modalId="passwordResetModal">
      {(open: any) => (
        <Button
          is="button"
          bgColor="transparent"
          className="u-link-green"
          spacing="none"
          onClick={open}
        >
          {translate({ zh_hant: '忘記密碼', zh_hans: '忘记密码', lang })}？
        </Button>
      )}
    </ModalSwitch>
  )

  const BaseForm = ({
    values,
    errors,
    touched,
    isSubmitting,
    handleBlur,
    handleChange,
    handleSubmit
  }: {
    [key: string]: any
  }) => {
    const formClass = classNames('form', ...extraClass)

    const emailPlaceholder = translate({
      zh_hant: '請輸入電子信箱',
      zh_hans: '请输入邮箱',
      lang
    })

    const passwordPlaceholder = translate({
      zh_hant: '請輸入密碼',
      zh_hans: '请输入密码',
      lang
    })

    const loginText = translate({
      zh_hant: '登入',
      zh_hans: '登入',
      lang
    })

    return (
      <>
        <form className={formClass} onSubmit={handleSubmit}>
          <Form.Input
            type="text"
            field="email"
            placeholder={emailPlaceholder}
            values={values}
            errors={errors}
            touched={touched}
            handleBlur={handleBlur}
            handleChange={handleChange}
          />
          <Form.Input
            type="password"
            field="password"
            placeholder={passwordPlaceholder}
            values={values}
            errors={errors}
            touched={touched}
            handleBlur={handleBlur}
            handleChange={handleChange}
          />
          <div className="buttons">
            <Button
              type="submit"
              bgColor="green"
              style={{ minWidth: '5rem' }}
              disabled={isSubmitting}
              icon={isSubmitting ? <IconSpinner /> : null}
            >
              {loginText}
            </Button>
            {purpose === 'modal' && <PasswordResetModalSwitch />}
            {purpose === 'page' && <PasswordResetRedirectButton />}
          </div>
        </form>
        <style jsx>{styles}</style>
      </>
    )
  }

  const MainForm: any = withFormik({
    mapPropsToValues: () => ({
      email: '',
      password: ''
    }),

    validate: ({ email, password }) => {
      const isInvalidEmail = validateEmail(email, lang)
      const isInvalidPassword = validatePassword(password, lang)
      const errors = {
        ...(isInvalidEmail ? { email: isInvalidEmail } : {}),
        ...(isInvalidPassword ? { password: isInvalidPassword } : {})
      }
      return errors
    },

    handleSubmit: (values, { props, setErrors, setSubmitting }: any) => {
      const { email, password } = values
      const { submitAction } = props
      if (!submitAction) {
        return undefined
      }
      submitAction({ variables: { input: { email, password } } })
        .then(async (result: any) => {
          if (submitCallback) {
            submitCallback()
          }
          window.dispatchEvent(
            new CustomEvent(ADD_TOAST, {
              detail: {
                color: 'green',
                content: <Translate zh_hant="登入成功" zh_hans="登入成功" />
              }
            })
          )
          analytics.identifyUser()
          analytics.trackEvent(ANALYTICS_EVENTS.LOG_IN)

          await clearPersistCache()
          redirectToTarget()
        })
        .catch((error: any) => {
          const errorCodes = getErrorCodes(error)

          if (errorCodes.indexOf(ERROR_CODES.USER_EMAIL_NOT_FOUND) >= 0) {
            setErrors({
              email: translate({
                zh_hant: TEXT.zh_hant.error.USER_EMAIL_NOT_FOUND,
                zh_hans: TEXT.zh_hans.error.USER_EMAIL_NOT_FOUND,
                lang
              })
            })
          } else if (
            errorCodes.indexOf(ERROR_CODES.USER_PASSWORD_INVALID) >= 0
          ) {
            setErrors({
              password: translate({
                zh_hant: TEXT.zh_hant.error.USER_PASSWORD_INVALID,
                zh_hans: TEXT.zh_hans.error.USER_PASSWORD_INVALID,
                lang
              })
            })
          } else {
            setErrors({
              email: translate({
                zh_hant: TEXT.zh_hant.error.UNKNOWN_ERROR,
                zh_hans: TEXT.zh_hans.error.UNKNOWN_ERROR,
                lang
              })
            })
          }

          analytics.trackEvent(ANALYTICS_EVENTS.LOG_IN_FAILED, {
            email,
            error
          })
        })
        .finally(() => {
          setSubmitting(false)
        })
    }
  })(BaseForm)

  return (
    <>
      <Mutation mutation={MUTATION_USER_LOGIN}>
        {login => <MainForm submitAction={login} />}
      </Mutation>
      <style jsx>{styles}</style>
    </>
  )
}

export default LoginForm
