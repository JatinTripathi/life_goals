from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.timezone import make_naive

from life_goals.models import LifeGoal

import json, datetime

brief_description_max = 10


def home(request):
    try:
        return render(request, 'home.html')
        
    except Exception ,e:
        logging(e)


@csrf_exempt
def goal(request):
    try:
        if (request.method == 'GET'):
            goal_type = request.GET.get('type')
            all_goals = []
            goals = LifeGoal.objects.all()

            for goal in goals:
                if str(goal.completed) == goal_type:
                    days_left = make_naive(goal.end_date, timezone=None) - datetime.datetime.now()
                    if goal.rest_description: more = '... More'
                    else: more = ''
                    data = {'id':goal.id, 
                            'name': goal.name, 
                            'text':goal.brief_description, 
                            'date':days_left.days, 
                            'complete':str(goal.completed),
                            'more': more}
                    all_goals.append(data)
                    
            return JsonResponse(all_goals, safe=False)
        
        if (request.method == 'POST'):
            data = request.POST

            a = data.get('end_date').decode('utf-8')
            end_date = datetime.datetime.strptime(a, '%Y-%m-%d')

            description_words_array = data.get('description').split()
            if len(description_words_array) > brief_description_max:
                brief_description = ' '.join(description_words_array[:brief_description_max])
                rest_description = ' '.join(description_words_array[brief_description_max:])
            else:
                brief_description = data.get('description')
                rest_description = None
            
            goal = LifeGoal(name = data.get('name'), 
                            brief_description = brief_description,
                            rest_description = rest_description, 
                            end_date = end_date,
                            completed = False)
            goal.save()
            
            return JsonResponse({'message': 'Saved'}, safe=False)

    except Exception ,e:
        logging(e)


@csrf_exempt
def complete(request):
    try:
        data = request.POST
        goal = LifeGoal.objects.get(pk = data.get('id'))

        if data.get('completed') == 'True':
            goal.completed = True
            response = {'completed': 'True'}
        elif data.get('completed') == 'False':
            goal.completed = False
            response = {'completed': 'False'}
        goal.save()
        
        return JsonResponse(response, safe=False)

    except Exception ,e:
        logging(e)


@csrf_exempt
def more(request):
    try:
        goal = LifeGoal.objects.get(pk = request.POST.get('id'))
        response = {'description': goal.rest_description}
        return JsonResponse(response, safe=False)

    except Exception ,e:
        logging(e)


@csrf_exempt
def delete(request):
    try:
        goal = LifeGoal.objects.get(pk = request.POST.get('id'))
        response = {'id':goal.id}
        goal.delete()
        return JsonResponse(response, safe=False)

    except Exception ,e:
        logging(e)


@csrf_exempt
def update_goal(request):
    try:
        if (request.method == 'GET'):   
            pk = request.GET.get('id').strip()

            goal = LifeGoal.objects.get(pk = pk)
            
            date = str(goal.end_date)
            date = date.split(' ')

            description = goal.brief_description
            if goal.rest_description:
                description = description + goal.rest_description

            response = {
                'name': goal.name,
                'text': description,
                'end_date': date[0],
                'id': goal.id}
                
            return JsonResponse(response, safe=False)

        if (request.method == 'POST'):
            data = request.POST

            a = data.get('end_date').decode('utf-8')
            end_date = datetime.datetime.strptime(a, '%Y-%m-%d')

            description_words_array = data.get('description').split()
            if len(description_words_array) > brief_description_max:
                brief_description = ' '.join(description_words_array[:brief_description_max])
                rest_description = ' '.join(description_words_array[brief_description_max:])
            else:
                brief_description = data.get('description')
                rest_description = None
            
            goal = LifeGoal.objects.get(pk = data.get('id'))
            goal.name = data.get('name')
            goal.brief_description = brief_description
            goal.rest_description = rest_description
            goal.end_date = end_date
            goal.save()
            
            return JsonResponse({'message': 'Saved'}, safe=False)


    except Exception ,e:
        logging(e)


def logging(err):
    print err