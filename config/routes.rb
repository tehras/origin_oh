OlgasHelpers::Application.routes.draw do

  resources :clients

  root :to => "home#index"

  get '/index', to: 'home#index'
  devise_for :users, :controllers => {:registrations => "registrations"}
  resources :users
  resources :caretakers
  resources :managements
  resources :clients

end