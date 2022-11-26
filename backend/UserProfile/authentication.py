from operator import truediv
from rest_framework.authentication import get_authorization_header
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.views import APIView
from .serializers import UserTokenSerializer
from django.contrib.sessions.models import Session
from django.views.decorators.csrf import csrf_exempt
from chatapp import settings



class Authentication(object):

    def get_user(self, request):
        tokenkey = get_authorization_header(request).split()
        if tokenkey:
            try:
                tokenkey = tokenkey[1].decode()
            except:
                return None
            
            try:
                token = Token.objects.select_related('user').get(key=tokenkey)
                user = token.user
            except Token.DoesNotExist:
                return 'Token invalido'
            
            if token is not None:
                if not token.user.is_active:
                    return 'Usuario inactivo o eliminado'

                return user

        return None


    def dispatch(self, request, *args, **kwargs):
        user_or_error = self.get_user(request)

        if user_or_error is not None:
            return user_or_error

        return 'No se han enviado las credenciales'



def getUserAutenticated(request):
    auth = Authentication()
    user_or_error = auth.dispatch(request)
    return user_or_error



class Login(ObtainAuthToken):

    def post(self, request, *args, **kwargs):
        #serializer del 'username' y 'password'
        login_serializer = self.serializer_class(data=request.data, context={'request':request})    
        response = Response()

        #Si el usuario existe y el password es correcto
        if login_serializer.is_valid():     
            user = login_serializer.validated_data['user']

            #Si el usuario esta activo generamos el Token
            if user.is_active:                   
                token, created = Token.objects.get_or_create(user=user)     
                user_serializer = UserTokenSerializer(user)
                if created:
                    #Si es la primera vez, se crea uno nuevo
                    response.data = {
                        'token': token.key,
                        'user': user_serializer.data,
                        'message': "Loged"
                    }
                    return response
                else:
                    #Si no es la primera vez, borramos todas las sesiones activas que pueda tener 
                    all_sessions = Session.objects.filter(expire_date__gte=datetime.now())
                    if all_sessions.exists():
                        for session in all_sessions:
                            session_data = session.get_decoded()
                            if user.id == int(session_data.get('_auth_user_id')):
                                session.delete()
                    #Eliminamos el Token y genearmos uno nuevo
                    token.delete()
                    token = Token.objects.create(user=user)
                    response.data = {
                        'token': token.key,
                        'user': user_serializer.data,
                        'message': "Loged"
                    }
                    return response
            else:
                #Si el usuario no esta activo no le permitimos el login
                return Response({'error': 'Este usuario no puede iniciar sesión'}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            #Si el no usuario existe o el password es incorrecto
            return Response({'error': 'Nombre de usuario o contraseña incorrectos'}, status=status.HTTP_400_BAD_REQUEST)



class Logout(APIView):

    def post(self, request, *args, **kwargs):
        #Probamos si se encunetra el Token
        try:
            #Obtenemos el Token desde request
            token = request.META['HTTP_AUTHORIZATION'].split()[1]
            token = Token.objects.filter(key=token).first()

            #Si existe el Token en la BD eliminamos el token y todas las sesiones del usuarios
            if token:
                user = token.user
                all_sessions = Session.objects.filter(expire_date__gte=datetime.now())
                if all_sessions.exists():
                    for session in all_sessions:
                        session_data = session.get_decoded()
                        if user.id == int(session_data.get('_auth_user_id')):
                            session.delete()
                token.delete()
                return Response({'token_message': 'Token eliminado', 'session_message': 'Sesiones cerradas'}, status=status.HTTP_200_OK)

            #Si no, devolvemos un error
            return Response({'error': 'No se ha encontrado un usuario con estas credenciales'}, status=status.HTTP_400_BAD_REQUEST)
        
        #Si no se encuentra devolvemos un error
        except:
            return Response({'error': 'Token no encontrado'}, status=status.HTTP_409_CONFLICT)


