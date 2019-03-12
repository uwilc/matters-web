import classNames from 'classnames'
import { withFormik } from 'formik'
import gql from 'graphql-tag'
import { FC, useContext } from 'react'

import { Button } from '~/components/Button'
import { Form } from '~/components/Form'
import { checkFormError } from '~/components/Form/Error'
import { Mutation } from '~/components/GQL'
import { LanguageContext } from '~/components/Language'

import { ERROR_CODES } from '~/common/enums'
import { isValidEmail, translate } from '~/common/utils'

import styles from './styles.css'

interface Props {
  defaultEmail: string
  extraClass?: string[]
  submitCallback?: (params: any) => void
}

const MUTATION_CONFIRM_CODE = gql`
  mutation ConfirmVerificationCode($input: ConfirmVerificationCodeInput!) {
    confirmVerificationCode(input: $input)
  }
`

export const EmailChangeRequestForm: FC<Props> = ({
  defaultEmail = '',
  extraClass = [],
  submitCallback
}) => {
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

  const validateCode = (value: string, language: string) => {
    let result: any
    if (!value) {
      result = { zh_hant: '必填欄位', zh_hans: '必填栏位' }
    }
    if (result) {
      return translate({ ...result, lang: language })
    }
  }

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

    const codePlaceholder = translate({
      zh_hant: '請輸入驗證碼',
      zh_hans: '请输入验证码',
      lang
    })

    return (
      <>
        <form className={formClass} onSubmit={handleSubmit}>
          <Form.Input
            type="text"
            field="email"
            values={values}
            errors={errors}
            touched={touched}
            handleBlur={handleBlur}
            handleChange={handleChange}
            disabled={true}
          />
          <Form.Input
            type="text"
            field="code"
            placeholder={codePlaceholder}
            style={{ marginTop: '0.6rem', paddingRight: '6rem' }}
            floatElement={
              <Form.SendCodeButton
                email={values.email}
                lang={lang}
                type="email_reset"
              />
            }
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
              style={{ width: 80 }}
              disabled={isSubmitting}
            >
              {translate({ zh_hant: '下一步', zh_hans: '下一步', lang })}
            </Button>
          </div>
        </form>
        <style jsx>{styles}</style>
      </>
    )
  }

  const MainForm: any = withFormik({
    mapPropsToValues: () => ({
      email: defaultEmail,
      code: ''
    }),

    validate: ({ email, code }) => {
      const isInvalidEmail = validateEmail(email, lang)
      const isInvalidCode = validateCode(code, lang)
      const errors = {
        ...(isInvalidEmail ? { email: isInvalidEmail } : {}),
        ...(isInvalidCode ? { code: isInvalidCode } : {})
      }
      return errors
    },

    handleSubmit: (values, { props, setFieldError, setSubmitting }: any) => {
      const { email, code } = values
      const { submitAction } = props
      if (!submitAction) {
        return undefined
      }

      submitAction({
        variables: { input: { email, type: 'email_reset', code } }
      })
        .then(({ data }: any) => {
          const { confirmVerificationCode } = data
          if (submitCallback && confirmVerificationCode) {
            submitCallback({ codeId: confirmVerificationCode })
          }
        })
        .catch(({ graphQLErrors: error }: any) => {
          const { CODE_INVALID, CODE_EXPIRED } = ERROR_CODES
          const codeInvalidHint = checkFormError(CODE_INVALID, error, lang)
          if (codeInvalidHint) {
            setFieldError('code', codeInvalidHint)
          }
          const codeExpiredHint = checkFormError(CODE_EXPIRED, error, lang)
          if (codeExpiredHint) {
            setFieldError('code', codeExpiredHint)
          }
        })
        .finally(() => {
          setSubmitting(false)
        })
    }
  })(BaseForm)

  return (
    <>
      <Mutation mutation={MUTATION_CONFIRM_CODE}>
        {confirmCode => <MainForm submitAction={confirmCode} />}
      </Mutation>
      <style jsx>{styles}</style>
    </>
  )
}