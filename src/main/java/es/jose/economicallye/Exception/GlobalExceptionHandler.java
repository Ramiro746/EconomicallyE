package es.jose.economicallye.Exception;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.NoSuchMessageException;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

  @Autowired
  private MessageSource messageSource;

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<Map<String, String>> handleValidationExceptions(
          MethodArgumentNotValidException ex, WebRequest request) {

    // Obtiene el locale de la solicitud actual
    Locale locale = LocaleContextHolder.getLocale();
    Map<String, String> errors = new HashMap<>();

    ex.getBindingResult().getAllErrors().forEach(error -> {
      String fieldName = ((FieldError) error).getField();
      String errorMessage = resolveErrorMessage(error, locale);
      errors.put(fieldName, errorMessage);
    });

    return ResponseEntity.badRequest().body(errors);
  }

  private String resolveErrorMessage(ObjectError error, Locale locale) {
    if (error instanceof FieldError) {
      FieldError fieldError = (FieldError) error;
      for (String code : fieldError.getCodes()) {
        try {
          return messageSource.getMessage(code, fieldError.getArguments(), locale);
        } catch (NoSuchMessageException e) {
          // Continuar con el siguiente código
        }
      }
    }
    return error.getDefaultMessage();
  }
  @ExceptionHandler(EmailAlreadyExistsException.class)
  public ResponseEntity<Map<String, String>> handleEmailAlreadyExistsException(EmailAlreadyExistsException ex) {
    Map<String, String> error = new HashMap<>();
    error.put("email", ex.getMessage());
    return ResponseEntity.badRequest().body(error);
  }

}